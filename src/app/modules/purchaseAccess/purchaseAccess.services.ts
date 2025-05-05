import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { IPurchaseAccess } from "./purchaseAccess.interface"
import { PurchaseAccess } from "./purchaseAccess.model";
import mongoose from "mongoose";
import { TrainingSession } from "../session/session.model";


const checkEnrollment = async (data: IPurchaseAccess): Promise<{ enrolled: boolean; result: IPurchaseAccess | null }>=> {

    const result = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id,
    })

    return {
        enrolled: !!result,
        result: result ? result : null,
    };
}

const enrollNow = async (data: IPurchaseAccess): Promise<IPurchaseAccess> => {
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
    if (data) {
        data.trainer_id = session?.trainer_id;
    }
    const result = await PurchaseAccess.create(data);
    return result;
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


export const purchaseAccessServices = {
    checkEnrollment,
    enrollNow,
    myEnrolledSesion,
    getTotalEnrollment,
    getTotalEnrollmentForTrainer,
    myMemberships,
    markVideoAsComplete,
}