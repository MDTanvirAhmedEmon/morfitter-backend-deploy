import mongoose from "mongoose"
import AppError from "../../errors/AppError"
import { Invitation } from "../invitation/invitation.model"
import { Trainee } from "../trainee/trainee.model"
import { Trainer } from "../trainer/trainer.model"
import { IReview } from "./review.interface"
import { Review } from "./review.model"


const giveReview = async (data: IReview): Promise<IReview> => {

    const isTrainerExist = await Trainer.findById({ _id: data?.trainer_id })
    if (!isTrainerExist) {
        throw new AppError(404, 'trainer does not exist!')
    }

    const isTraineeExist = await Trainee.findById({ _id: data?.trainee_id })
    if (!isTraineeExist) {
        throw new AppError(404, 'trainee does not exist!')
    }

    const result = await Review.create(data)
    if (result) {
        await Invitation.deleteOne({
            trainer_id: result.trainer_id,
            trainee_id: result.trainee_id,
        })
    }
    return result
}

const getReviewOfTrainer = async (id: string): Promise<IReview[]> => {

    const isTrainerExist = await Trainer.findById({ _id: id })
    if (!isTrainerExist) {
        throw new AppError(404, 'trainer does not exist!')
    }
    const allReviews = await Review.aggregate([
        { $match: { trainer_id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "trainees",
                localField: "trainee_id",
                foreignField: "_id",
                as: "traineeData"
            }
        },
        {
            $unwind: "$traineeData",
        },
        { $limit: 9 },
        { $sort: { createdAt: -1 } }
    ])
    return allReviews
}


export const reviewServices = {
    giveReview,
    getReviewOfTrainer,
}