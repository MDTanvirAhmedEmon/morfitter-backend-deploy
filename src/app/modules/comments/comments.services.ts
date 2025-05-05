import { JwtPayload } from "jsonwebtoken";
import { IComments } from "./comments.interface";
import { Comments } from "./comments.model";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";


const doComment = async (data: Partial<IComments>, user: JwtPayload | null): Promise<IComments | null> => {
    data.user_id = user?.id
    const result = await Comments.create(data);
    return result;
};

const getAllComments = async (id: string): Promise<IComments[] | null> => {
    const result = await Comments.aggregate([
        {
            $match: { content_id: new mongoose.Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                "user.password": 0
            }
        },
        {
            $lookup: {
                from: "trainers",
                localField: "user._id",
                foreignField: "user",
                as: "trainerDetails"
            }
        },
        {
            $lookup: {
                from: "trainees",
                localField: "user._id",
                foreignField: "user",
                as: "traineeDetails"
            }
        },
        {
            $addFields: {
                userInfo: {
                    $cond: {
                        if: { $gt: [{ $size: "$trainerDetails" }, 0] },
                        then: { $arrayElemAt: ["$trainerDetails", 0] },
                        else: { $arrayElemAt: ["$traineeDetails", 0] }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                text: 1,
                content_id: 1,
                user_id: 1,
                createdAt: 1,
                updatedAt: 1,
                "user_image": "$userInfo.profileImageUrl",
                "user_name": { $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"] },
                "user_address": "$userInfo.country",
                "role": "$user.role"
            }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 20}
    ]);

    return result;
};


const deleteMyComment = async (id: string, user: JwtPayload | null): Promise<IComments | null> => {
    const comment = await Comments.findById(id);
    if (!comment) throw new AppError(400, "Comment not found");

    if (!user || comment.user_id.toString() !== user.id) {
        throw new AppError(400, "You are not authorized to delete this comment");
    }
    const result = await Comments.findByIdAndDelete({ _id: id });
    return result;
};

export const commentsServices = {
    doComment,
    getAllComments,
    deleteMyComment,
};
