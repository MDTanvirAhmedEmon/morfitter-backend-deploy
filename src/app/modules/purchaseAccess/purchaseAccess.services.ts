import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { IPurchaseAccess } from "./purchaseAccess.interface"
import { PurchaseAccess } from "./purchaseAccess.model";
import mongoose from "mongoose";
import { TrainingSession } from "../session/session.model";
import { Trainer } from "../trainer/trainer.model";
import Stripe from 'stripe';
import config from "../../config";
import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import { Trainee } from "../trainee/trainee.model";

const stripe = new Stripe(config.stripe_secret_key!, {
    apiVersion: '2025-06-30.basil',
});

const checkEnrollment = async (data: IPurchaseAccess): Promise<{ enrolled: boolean; result: IPurchaseAccess | null }> => {

    const result = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id,
    })

    return {
        enrolled: !!result,
        result: result ? result : null,
    };
}

const enrollNow = async (data: IPurchaseAccess): Promise<any> => {
    if (data.paymentStatus === 'paid') {
        //========================== For Paid Sesssion =====================================
        const isExist = await PurchaseAccess.findOne({
            session_id: data?.session_id,
            user_id: data?.user_id,
        })

        if (isExist) {
            throw new AppError(400, "User already enrolled in this session");
        }

        const TrainerSession = await TrainingSession.findOne({
            _id: data?.session_id,
        })

        if (!TrainerSession) {
            throw new AppError(400, "session not found");
        }
        if (typeof TrainerSession.membership_fee !== "number") {
            throw new AppError(400, "Session membership fee is not defined.");
        }

        const trainer = await Trainer.findById({ _id: TrainerSession?.trainer_id })
        const trainee = await Trainee.findOne({ user: data?.user_id })
        if (!trainer?.stripeAccountId) {
            throw new AppError(400, "trainer did not connect his payment method");
        }
        if (!trainee) {
            throw new AppError(400, "trainer does not exist");
        }
        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: TrainerSession?.title,
                        },
                        unit_amount: Math.floor(TrainerSession?.membership_fee * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${config.stripe_payment_success_url}`,
            cancel_url: `${config.stripe_payment_cancel_url}`,
            payment_intent_data: {
                application_fee_amount: Math.floor(TrainerSession?.membership_fee * 0.1 * 100),
                transfer_data: {
                    destination: trainer?.stripeAccountId,
                },
            },
        });

        await PurchaseAccess.create({
            user_id: data?.user_id,
            session_id: data?.session_id,
            trainer_id: TrainerSession?.trainer_id,
            trainerName: trainer?.firstName + ' ' + trainer?.lastName,
            buyerName: trainee?.firstName + ' ' + trainee?.lastName,
            purchase_session_id: session.id,
            totalAmount: TrainerSession?.membership_fee,
            trainerAmount: TrainerSession?.membership_fee * 0.9,
            platformAmount: TrainerSession?.membership_fee * 0.1,
            purchaseDate: new Date(),
            paymentStatus: 'pending',
            paymentDetails: { transactionId: session.id, amountPaid: TrainerSession?.membership_fee },
            currency: 'gbp',
        });

        await Trainer.findByIdAndUpdate(
            { _id: TrainerSession?.trainer_id },
            { $inc: { earning: TrainerSession?.membership_fee * 0.9 } }
        );
        return { url: session.url };
    } else {
        //========================== For Free Sesssion =====================================
        const session = await TrainingSession.findOne({
            _id: data?.session_id,
        })


        const isExist = await PurchaseAccess.findOne({
            session_id: data?.session_id,
            user_id: data?.user_id,
        })

        if (isExist) {
            throw new AppError(400, "User already enrolled in this session");
        }
        const trainer = await Trainer.findById({ _id: session?.trainer_id })
        const trainee = await Trainee.findOne({ user: data?.user_id })
        if (!trainer) {
            throw new AppError(400, "trainer does not exist");
        }
        if (!trainee) {
            throw new AppError(400, "trainer does not exist");
        }
        data.trainerName = trainer?.firstName + ' ' + trainer?.lastName;
        data.buyerName = trainee?.firstName + ' ' + trainee?.lastName;
        if (data) {
            data.trainer_id = session?.trainer_id;
        }
        const result = await PurchaseAccess.create(data);
        return result;
    }
}

const myEnrolledSesion = async (data: JwtPayload | null) => {

    const session = await PurchaseAccess.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(String(data?.id)) } },
        {
            $lookup: {
                from: "trainingsessions",
                localField: "session_id",
                foreignField: "_id",
                as: "sessionDetails",
            }
        },
        { $unwind: { path: "$sessionDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "trainers",
                localField: "sessionDetails.trainer_id",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "sessionreviews",
                localField: "session_id",
                foreignField: "session_id",
                as: "reviews",
            },
        },
        { $unwind: { path: "$reviews", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$_id",
                session_id: { $first: "$session_id" },
                trainer_id: { $first: "$trainer_id" },
                user_id: { $first: "$user_id" },
                purchaseDate: { $first: "$purchaseDate" },
                paymentStatus: { $first: "$paymentStatus" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                sessionDetails: { $first: "$sessionDetails" },
                owner: {
                    $first: {
                        name: { $concat: ["$owner.firstName", " ", "$owner.lastName"] },
                        profileImageUrl: "$owner.profileImageUrl",
                        onlineSession: "$owner.onlineSession",
                        faceToFace: "$owner.faceToFace",
                        consultationType: "$owner.consultationType"
                    }
                },
                totalReviews: { $sum: { $cond: [{ $ifNull: ["$reviews.rating", false] }, 1, 0] } },
                averageRating: { $avg: { $ifNull: ["$reviews.rating", 0] } }
            }
        },
        {
            $project: {
                "sessionDetails.recordedContent": 0,
                "sessionDetails.trainer_id": 0
            }
        }
    ])

    return session;
}

const getTotalEnrollment = async (sessionId: string) => {
    const result = await PurchaseAccess.aggregate([
        {
            $match: { session_id: new mongoose.Types.ObjectId(sessionId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        { $unwind: "$userInfo" },
        {
            $lookup: {
                from: "trainees",
                localField: "userInfo._id",
                foreignField: "user",
                as: "traineeInfo"
            }
        },
        { $unwind: { path: "$traineeInfo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "trainers",
                localField: "userInfo._id",
                foreignField: "user",
                as: "trainerInfo"
            }
        },
        { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                additionalInfo: {
                    $cond: {
                        if: { $gt: [{ $type: "$trainerInfo" }, "missing"] },
                        then: "$trainerInfo",
                        else: "$traineeInfo"
                    }
                }
            }
        },
        {
            $project: {
                userInfo: 0,
                trainerInfo: 0,
                traineeInfo: 0
            }
        }
    ]);

    return result;
};

const getTotalEnrollmentForTrainer = async (trainerId: any) => {
    const result = await PurchaseAccess.aggregate([
        { $match: { trainer_id: new mongoose.Types.ObjectId(String(trainerId)) } },
        { $count: "totalMembers" }
    ]);
    return result.length > 0 ? result : [{ totalMembers: 0 }];
}

const myMemberships = async (user: any) => {
    const result = await PurchaseAccess.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(String(user?.id)) } },
        { $count: "totalMembership" }
    ]);

    return result.length > 0 ? result : [{ totalMembership: 0 }];
};

const markVideoAsComplete = async (data: any): Promise<IPurchaseAccess | null> => {
    const purchase = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id,
    });

    if (!purchase) {
        throw new AppError(400, 'Session not found for this user.');
    }

    if (purchase.completedVideos.includes(data?.video_id)) {
        throw new AppError(400, "Video already marked as completed.");
    }

    purchase.completedVideos.push(data?.video_id);

    const session = await TrainingSession.findById(data?.session_id);
    if (!session) {
        throw new AppError(400, "Session not found.");
    }

    const totalVideos = session.recordedContent?.length || 0;
    const sessionCompleted = purchase.completedVideos.length >= totalVideos;

    const updatedPurchase = await PurchaseAccess.findByIdAndUpdate(
        purchase._id,
        {
            completedVideos: purchase.completedVideos,
            sessionCompleted: sessionCompleted
        },
        { new: true }
    );


    return updatedPurchase;
};


const getAllPayments = async (
    paginationOptions: IPaginationOptions,
    searchTerm: any,
) => {

    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);


    const andConditions = [];
    const contentSearchableFields = ["buyerName", "trainerName", "paymentStatus"];

    if (searchTerm) {
        andConditions.push({
            $or: contentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }

    // if (Object.keys(filtersData).length) {
    //     andConditions.push({
    //         $and: Object.entries(filtersData).map(([field, value]) => ({
    //             [field]: value,
    //         })),
    //     });
    // }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await PurchaseAccess.aggregate([
        {
            $match: whereConditions
        },
        {
            $lookup: {
                from: "trainers",
                localField: "trainer_id",
                foreignField: "_id",
                as: "trainer",
                pipeline: [
                    {
                        $project: {
                            firstName: 1,
                            lastName: 1,
                            profileImageUrl: 1
                        }
                    }
                ]
            },
        },
        {
            $unwind: {
                path: "$trainer",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "trainees",
                localField: "user_id",
                foreignField: "user",
                as: "buyer",
                pipeline: [
                    {
                        $project: {
                            firstName: 1,
                            lastName: 1,
                            contactNo: 1,
                            profileImageUrl: 1
                        }
                    }
                ]
            },
        },
        {
            $unwind: {
                path: "$buyer",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: sortConditions,
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);

    const total = await PurchaseAccess.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};


export const purchaseAccessServices = {
    checkEnrollment,
    enrollNow,
    myEnrolledSesion,
    getTotalEnrollment,
    getTotalEnrollmentForTrainer,
    myMemberships,
    markVideoAsComplete,
    getAllPayments,
}