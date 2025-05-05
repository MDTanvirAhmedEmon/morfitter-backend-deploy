import { JwtPayload } from "jsonwebtoken";
import { Trainer } from "../trainer/trainer.model";
import { User } from "../users/user.model";
import { TrainingSession } from "./session.model";
import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import mongoose from "mongoose";
import { ITrainingSession } from "./session.interface";
import AppError from "../../errors/AppError";
// import { uploadToCloudinary } from "../../helpers/fileUploader";
import { PurchaseAccess } from "../purchaseAccess/purchaseAccess.model";


const createSession = async (image: Express.Multer.File, video: Express.Multer.File, user: any, content: any) => {

    // const uploadedImage: any = await uploadToCloudinary(image)
    // content.promo_image = uploadedImage.secure_url

    // const uploadedVideo: any = await uploadToCloudinary(video)
    // content.promo_video = uploadedVideo.secure_url

    content.promo_image = `/uploads/${image.filename}`;
    content.promo_video = `/uploads/${video.filename}`;
    const isExistUser = await User.findOne({ email: user.email });

    if (!isExistUser) {
        throw new Error('User not found');
    }
    const isExistTrainer = await Trainer.findOne({ user: isExistUser._id });
    if (!isExistTrainer) {
        throw new Error('Trainer not found');
    }
    content.trainer_id = isExistTrainer._id;
    content.status = "in-progress";

    const result = await TrainingSession.create(content);
    return result;
}

const updateSessionDetails = async (
    id: string,
    image: Express.Multer.File | null,
    video: Express.Multer.File | null,
    content: any
) => {

    try {
        if (image) {
            // const uploadedImage: any = await uploadToCloudinary(image);
            // content.promo_image = uploadedImage.secure_url;
            content.promo_image = `/uploads/${image.filename}`;
        }

        if (video) {
            // const uploadedVideo: any = await uploadToCloudinary(video);
            // content.promo_video = uploadedVideo.secure_url;
            content.promo_video = `/uploads/${video.filename}`;
        }

        const result = await TrainingSession.findByIdAndUpdate(
            { _id: id },
            content,
            { new: true }
        );

        return result;
    } catch (error) {
        throw new AppError(400, 'Failed to update session details');
    }
};


const updateSession = async (id: string, file: any, user: any, content: any) => {

    // const uploadedImage: any = await uploadToCloudinary(file)
    // data.profileImageUrl = uploadedImage.secure_url
    // const newVideo = {
    //     title: content.recordedContent.title,
    //     url: uploadedImage.secure_url,
    //     duration: content.recordedContent.duration,
    // };

    const newVideo = {
        title: content.recordedContent.title,
        url: `/uploads/${file.filename}`,
        duration: content.recordedContent.duration,
    };

    const result = await TrainingSession.findByIdAndUpdate(
        { _id: id },
        {
            $push: { recordedContent: newVideo }
        },
        { new: true }
    );

    return result;
}

const getAllSession = async (
    paginationOptions: IPaginationOptions,
    searchTerm: string | undefined,
    filtersData: any,
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);


    const andConditions = [];
    const contentSearchableFields = ["title"];

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

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const totalResult = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $count: "total" },
    ]);
    const result = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $match: { status: { $ne: "blocked" } } },
        {
            $lookup: {
                from: "trainers",
                localField: "trainer_id",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            name: { $concat: ["$firstName", " ", "$lastName"] },
                            profileImageUrl: 1,
                            onlineSession: 1,
                            faceToFace: 1,
                            consultationType: 1,
                            qualification: 1
                        }
                    }
                ]
            }
        },

        {
            $lookup: {
                from: "sessionreviews",
                localField: "_id",
                foreignField: "session_id",
                as: "reviews",
            },
        },
        {
            $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                trainer_id: { $first: "$trainer_id" },
                owner: { $first: "$owner" },
                sessionType: { $first: "$sessionType" },
                title: { $first: "$title" },
                sessionMode: { $first: "$sessionMode" },
                fitnessFocus: { $first: "$fitnessFocus" },
                description: { $first: "$description" },
                otherFocus: { $first: "$otherFocus" },
                accessType: { $first: "$accessType" },
                frequency: { $first: "$frequency" },
                membership_fee: { $first: "$membership_fee" },
                promo_image: { $first: "$promo_image" },
                promo_video: { $first: "$promo_video" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                status: { $first: "$status" },
                totalReviews: { $sum: { $cond: [{ $ifNull: ["$reviews.rating", false] }, 1, 0] } },
                averageRating: { $avg: "$reviews.rating" }
            }
        },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                recordedContent: 0
            }
        }
    ]);


    const total = totalResult.length > 0 ? totalResult[0].total : 0;



    return {
        meta: { page, limit, total },
        data: result,
    };
}

const getAllSessionForAdmin = async (
    paginationOptions: IPaginationOptions,
    searchTerm: string | undefined,
    filtersData: any,
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);


    const andConditions = [];
    const contentSearchableFields = ["title"];

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

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const totalResult = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $count: "total" },
    ]);
    const result = await TrainingSession.aggregate([
        { $match: whereConditions },
        {
            $lookup: {
                from: "trainers",
                localField: "trainer_id",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            name: { $concat: ["$firstName", " ", "$lastName"] },
                            profileImageUrl: 1,
                            onlineSession: 1,
                            faceToFace: 1,
                            consultationType: 1,
                            qualification: 1
                        }
                    }
                ]
            }
        },

        {
            $lookup: {
                from: "sessionreviews",
                localField: "_id",
                foreignField: "session_id",
                as: "reviews",
            },
        },
        {
            $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                trainer_id: { $first: "$trainer_id" },
                owner: { $first: "$owner" },
                sessionType: { $first: "$sessionType" },
                title: { $first: "$title" },
                sessionMode: { $first: "$sessionMode" },
                fitnessFocus: { $first: "$fitnessFocus" },
                description: { $first: "$description" },
                otherFocus: { $first: "$otherFocus" },
                accessType: { $first: "$accessType" },
                frequency: { $first: "$frequency" },
                membership_fee: { $first: "$membership_fee" },
                promo_image: { $first: "$promo_image" },
                promo_video: { $first: "$promo_video" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                status: { $first: "$status" },
                totalReviews: { $sum: { $cond: [{ $ifNull: ["$reviews.rating", false] }, 1, 0] } },
                averageRating: { $avg: "$reviews.rating" }
            }
        },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                recordedContent: 0
            }
        }
    ])
    const total = totalResult.length > 0 ? totalResult[0].total : 0;



    return {
        meta: { page, limit, total },
        data: result,
    };
}

const getMySession = async (
    trainerId: string,
    paginationOptions: IPaginationOptions,
    searchTerm?: string,
    filtersData: Record<string, any> = {},
) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const andConditions: any[] = [{ trainer_id: new mongoose.Types.ObjectId(trainerId) }];

    const contentSearchableFields = ["title"];

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

    if (Object.keys(filtersData).length) {
        Object.entries(filtersData).forEach(([field, value]) => {
            andConditions.push({ [field]: value });
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === "asc" || sortOrder === "ascending" ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const totalResult = await TrainingSession.aggregate([
        { $match: whereConditions },
        { $count: "total" },
    ]);

    const result = await TrainingSession.aggregate([
        { $match: whereConditions },
        {
            $lookup: {
                from: "trainers",
                localField: "trainer_id",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            name: { $concat: ["$firstName", " ", "$lastName"] },
                            profileImageUrl: 1,
                            onlineSession: 1,
                            faceToFace: 1,
                            consultationType: 1,
                            qualification: 1
                        }
                    }
                ]
            }
        },

        {
            $lookup: {
                from: "sessionreviews",
                localField: "_id",
                foreignField: "session_id",
                as: "reviews",
            },
        },
        {
            $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                trainer_id: { $first: "$trainer_id" },
                owner: { $first: "$owner" },
                sessionType: { $first: "$sessionType" },
                title: { $first: "$title" },
                sessionMode: { $first: "$sessionMode" },
                fitnessFocus: { $first: "$fitnessFocus" },
                description: { $first: "$description" },
                otherFocus: { $first: "$otherFocus" },
                accessType: { $first: "$accessType" },
                frequency: { $first: "$frequency" },
                membership_fee: { $first: "$membership_fee" },
                promo_image: { $first: "$promo_image" },
                promo_video: { $first: "$promo_video" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                status: { $first: "$status" },
                totalReviews: { $sum: { $cond: [{ $ifNull: ["$reviews.rating", false] }, 1, 0] } },
                averageRating: { $avg: "$reviews.rating" }
            }
        },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                recordedContent: 0
            }
        }
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
        meta: { page, limit, total },
        data: result,
    };
};


const getSingleSession = async (
    id: string,
    userId: string,
): Promise<ITrainingSession | null> => {
    const result = await TrainingSession.findById({ _id: new mongoose.Types.ObjectId(id) }).lean();
    if (!result) return null;

    // Ensure recordedContent is always an array
    result.recordedContent = result.recordedContent || [];

    // Fetch completed videos for the user if userId is provided
    let completedVideosSet = new Set();
    if (userId) {
        const purchase = await PurchaseAccess.findOne({
            session_id: new mongoose.Types.ObjectId(id),
            user_id: new mongoose.Types.ObjectId(userId)
        }).lean();

        if (purchase && purchase.completedVideos) {
            completedVideosSet = new Set(purchase.completedVideos.map(videoId => videoId.toString()));
        }
    }

    result.recordedContent = result.recordedContent.map(video => ({
        ...video,
        completed: completedVideosSet.has(video._id?.toString() || "")
    }));

    return result;
};

const getSingleForAdminSession = async (
    id: string,
): Promise<ITrainingSession | null> => {
    const result = await TrainingSession.findById({ _id: new mongoose.Types.ObjectId(id) })
    return result
};


const deleteSessionContent = async (
    data: any
): Promise<ITrainingSession | null> => {
    const sessionId = data.sessionId
    const contentId = data.contentId
    const result = await TrainingSession.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(sessionId) },
        { $pull: { recordedContent: { _id: contentId } } },
        { new: true }
    );
    return result
};

const deleteWholeSession = async (
    id: string
): Promise<ITrainingSession | null> => {
    const result = await TrainingSession.findByIdAndDelete({ _id: id });
    return result
};


const blockUnblock = async (id: string): Promise<any> => {
    const session = await TrainingSession.findById(id);
    if (!session) {
        throw new AppError(400, 'session does not exits')
    }
    const newStatus = session?.status === "blocked" ? "in-progress" : "blocked";
    const uploadedStatus = {
        status: newStatus
    }

    const result = await TrainingSession.findByIdAndUpdate({ _id: id }, uploadedStatus, { new: true })

    return {
        message: `session ${result?.status}`
    }
}



export const sessionServices = {
    createSession,
    getAllSession,
    getAllSessionForAdmin,
    updateSessionDetails,
    updateSession,
    getMySession,
    getSingleSession,
    getSingleForAdminSession,
    deleteSessionContent,
    deleteWholeSession,
    blockUnblock,
}