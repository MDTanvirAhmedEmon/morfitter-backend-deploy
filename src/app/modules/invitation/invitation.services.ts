import mongoose, { ObjectId } from "mongoose";
import AppError from "../../errors/AppError";
import { IPaginationOptions } from "../../global/globalType";
import { paginationHelpers } from "../../helpers/pagination";
import { Trainee } from "../trainee/trainee.model";
import { Trainer } from "../trainer/trainer.model";
import { IInvitation } from "./invitation.interface";
import { Invitation } from "./invitation.model";


const sentInvitation = async (data: IInvitation): Promise<IInvitation> => {

    const isTrainerExist = await Trainer.findById({ _id: data?.trainer_id })
    if (!isTrainerExist) {
        throw new AppError(404, 'trainer does not exist!')
    }

    const isTraineeExist = await Trainee.findById({ _id: data?.trainee_id })
    if (!isTraineeExist) {
        throw new AppError(404, 'trainee does not exist!')
    }

    const alreadySent = await Invitation.findOne({
        trainer_id: data.trainer_id,
        trainee_id: data.trainee_id,
    });
    
    if (alreadySent) {
        throw new AppError(400, "Invitation has already been sent!");
    }
    
    const result = await Invitation.create(data)
    return result;
}


const getAllTrainee = async (paginationOptions: IPaginationOptions, searchTerm: any, trainer_id: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

    const getAllInvitations = await Invitation.find({ trainer_id: trainer_id });

    const invitedTraineeIds = getAllInvitations.map(invitation => invitation.trainee_id);
    
    const andConditions = [];

    const contentSearchableFields = ["firstName", "lastName", "email"];

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

    // Exclude trainees who have been invited
    if (invitedTraineeIds.length > 0) {
        andConditions.push({
            _id: { $nin: invitedTraineeIds }
        });
    }

    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' || sortOrder === 'ascending' ? 1 : -1;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Trainee.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
    const total = await Trainee.countDocuments(whereConditions);
    
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };

}

const getMyInvitation = async (trainee_id: string) => {
    const isTraineeExist = await Trainee.findById(trainee_id);
    if (!isTraineeExist) {
        throw new AppError(404, "Trainee does not exist!");
    }

    const invitations = await Invitation.aggregate([
        { $match: { trainee_id: new mongoose.Types.ObjectId(trainee_id) } },
        {
            $lookup: {
                from: "trainers",
                localField: "trainer_id",
                foreignField: "_id",
                as: "trainerData"
            }
        },
        { $unwind: "$trainerData" },
        // {
        //     $project: {
        //         _id: 1,
        //         trainee_id: 1,
        //         trainer_id: 1,
        //         status: 1,
        //         createdAt: 1,
        //         updatedAt: 1,
        //         "trainerData.firstName": "$userData.firstName",
        //         "trainerData.lastName": "$userData.lastName",
        //         "trainerData.email": "$userData.email",
        //         "trainerData.profileImageUrl": "$userData.profileImageUrl",
        //         "trainerData.userName": "$userData.userName",
        //         "trainerData.gender": "$userData.gender"
        //     }
        // }
    ]);

    return invitations;
};


const rejectInvitation = async (id: string): Promise<IInvitation | null> => {

    const result = Invitation.findByIdAndDelete({_id: id})
    
    return result;
}

export const invitationServices = {
    sentInvitation,
    getAllTrainee,
    getMyInvitation,
    rejectInvitation,
}