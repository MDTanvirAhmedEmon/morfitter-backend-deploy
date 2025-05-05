import mongoose from "mongoose"
import AppError from "../../errors/AppError"
import { PurchaseAccess } from "../purchaseAccess/purchaseAccess.model"
import { ISessionReview } from "./sessinReview.interface"
import { SessionReview } from "./sessinReview.model"


const giveReview = async (data: ISessionReview): Promise<ISessionReview> => {

    const purchase = await PurchaseAccess.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id,
    });

    const review = await SessionReview.findOne({
        session_id: data?.session_id,
        user_id: data?.user_id,
    });

    if (review) {
        throw new AppError(400, 'You have already given a review');
    }

    if (!purchase?.sessionCompleted) {
        throw new AppError(400, 'You did not complete the session');
    }
    const result = await SessionReview.create(data);
    return result
}

const getAllReviewOfSession = async (id: string): Promise<ISessionReview[] | null> => {

    const result = await SessionReview.aggregate([
        { $match: { session_id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                "userDetails.password": 0
            }
        },
        {
            $lookup: {
                from: "trainees",
                localField: "userDetails._id",
                foreignField: "user",
                as: "userinfo",
            },
        },
        {
            $project: {
                createdAt: 0,
                updatedAt: 0,
                "userDetails": 0,
            }
        }
    ]);
    return result
}

// const getReviewOfTrainer = async (id: string): Promise<IReview[]> => {

//     const isTrainerExist = await Trainer.findById({ _id: id })
//     if (!isTrainerExist) {
//         throw new AppError(404, 'trainer does not exist!')
//     }
//     const allReviews = await Review.aggregate([
//         { $match: { trainer_id: new mongoose.Types.ObjectId(id) } },
//         {
//             $lookup: {
//                 from: "trainees",
//                 localField: "trainee_id",
//                 foreignField: "_id",
//                 as: "traineeData"
//             }
//         },
//         {
//             $unwind: "$traineeData",
//         },
//         { $limit: 9 },
//         { $sort: { createdAt: -1 } }
//     ])
//     return allReviews
// }


export const sessionReviewServices = {
    giveReview,
    getAllReviewOfSession,
}