// import { upload, uploadToCloudinary } from './../../helpers/fileUploader';
import AppError from '../../errors/AppError';
import { Trainee } from '../trainee/trainee.model';
import { ITrainee } from '../trainee/trainee.interface';
import { IUser } from "./user.interface";
import { User } from "./user.model"
import { ITrainer } from '../trainer/trainer.interface';
import { Trainer } from '../trainer/trainer.model';
import mongoose from 'mongoose';
import { createToken } from '../../helpers/jwtHelper';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { Specialism } from '../specialism/specialism.model';

const createTrainee = async (validateUserInfo: Partial<IUser>, validateTraineeData: ITrainee, file: any): Promise<any> => {
    const userData = {
        email: validateUserInfo?.email,
        password: validateUserInfo?.password,
        role: "trainee",
        status: 'in-progress',
    }

    const userNameExist = await Trainee.findOne({ userName: validateTraineeData.userName })
    if (userNameExist) {
        throw new AppError(400, 'User Name already exists!')
    }
    const isExist = await User.findOne({ email: userData.email })

    if (isExist) {
        throw new AppError(400, 'User already exists!')
    }
    // if (file) {
    //     const uploadedImage: any = await uploadToCloudinary(file)
    //     validateTraineeData.profileImageUrl = uploadedImage.secure_url
    // }
    if (file) {
        validateTraineeData.profileImageUrl = `/uploads/${file.filename}`;
    }

    const result = await User.create(userData);

    if (result?._id) {
        validateTraineeData.user = result?._id

        const traineeResult = await Trainee.create(validateTraineeData)

        const tokenPayload = {
            email: result.email,
            id: result._id,
            role: result.role,
            status: result.status
        }

        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as Secret,
            config.jwt_access_expires_in as string,
        )
        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as Secret,
            config.jwt_refresh_expires_in as string,
        )

        return {
            refreshToken,
            accessToken,
            userInfo: traineeResult,
        }

    }
}

const createTrainer = async (validateUserInfo: Partial<IUser>, validateTrainerData: any, file: any, specialism: string[]): Promise<any> => {
    const userData = {
        email: validateUserInfo?.email,
        password: validateUserInfo?.password,
        role: "trainer",
        status: 'in-progress',
    }
    const userNameExist = await Trainer.findOne({ userName: validateTrainerData.userName })
    if (userNameExist) {
        throw new AppError(400, 'User Name already exists!')
    }
    const isExist = await User.findOne({ email: userData.email })

    if (isExist) {
        throw new AppError(400, 'User already exists!')
    }

    const result = await User.create(userData);
    // if (file) {
    //     const uploadedImage: any = await uploadToCloudinary(file)
    //     validateTrainerData.profileImageUrl = uploadedImage.secure_url
    // }

    if (file) {
        validateTrainerData.profileImageUrl = `/uploads/${file.filename}`;
    }

    if (result?._id) {
        validateTrainerData.user = result?._id

        const trainerResult = await Trainer.create(validateTrainerData)

        if (trainerResult?._id) {
            for (const spec of specialism) {
                await Specialism.create({ specialism: spec, trainer_id: trainerResult._id });
            }
        }

        const tokenPayload = {
            email: result.email,
            id: result._id,
            role: result.role,
            status: result.status
        }

        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as Secret,
            config.jwt_access_expires_in as string,
        )
        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as Secret,
            config.jwt_refresh_expires_in as string,
        )

        return {
            refreshToken,
            accessToken,
            userInfo: trainerResult,
        }

    }
}

const getMe = async (user: any) => {
    const userId = new mongoose.Types.ObjectId(user.id);
    const result = await User.aggregate([
        {
            $match: { _id: userId },
        },
        {
            $lookup: {
                from: 'trainers',
                localField: '_id',
                foreignField: 'user',
                as: 'trainerDetails',
            },
        },
        {
            $lookup: {
                from: 'trainees',
                localField: '_id',
                foreignField: 'user',
                as: 'traineeDetails',
            },
        },
        // Filter out empty arrays before returning the result
        {
            $addFields: {
                trainerDetails: {
                    $cond: { if: { $ne: ["$trainerDetails", []] }, then: "$trainerDetails", else: "$$REMOVE" },
                },
                traineeDetails: {
                    $cond: { if: { $ne: ["$traineeDetails", []] }, then: "$traineeDetails", else: "$$REMOVE" },
                },
            },
        },
    ]);
    return result;
};

// const getMeTrainee = async (user: any) => {
//     const userId = new mongoose.Types.ObjectId(user.id);
//     const result = await User.aggregate([
//         {
//             $match: { _id: userId },
//         },
//         {
//             $lookup: {
//                 from: 'trainees',
//                 localField: '_id',
//                 foreignField: 'user',
//                 as: 'traineeDetails',
//             },
//         },
//     ]);
//     return result
// }

const viewUser = async (id: any, loggedInUserId: any) => {
    const userId = new mongoose.Types.ObjectId(id);
    const loggedInId = new mongoose.Types.ObjectId(loggedInUserId.id);

    const result = await User.aggregate([
        {
            $match: { _id: userId },
        },
        {
            $lookup: {
                from: "trainers",
                localField: "_id",
                foreignField: "user",
                as: "trainerDetails",
            },
        },
        {
            $lookup: {
                from: "trainees",
                localField: "_id",
                foreignField: "user",
                as: "traineeDetails",
            },
        },
        {
            $lookup: {
                from: "followers",
                let: { viewedUserId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$follower_id", loggedInId] },
                                    { $eq: ["$following_id", "$$viewedUserId"] },
                                ],
                            },
                        },
                    },
                ],
                as: "followStatus",
            },
        },
        {
            $addFields: {
                userInfo: {
                    $arrayElemAt: [
                        { $concatArrays: ["$trainerDetails", "$traineeDetails"] },
                        0,
                    ],
                },
                isFollowing: { $gt: [{ $size: "$followStatus" }, 0] },
            },
        },
        {
            $project: {
                _id: 0,
                userInfo: 1,
                isFollowing: 1,
            },
        },
    ]);

    return result[0]
};

const newUser = async () => {
    const result = await User.aggregate([
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                password: 0
            }
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: "trainers",
                localField: "_id",
                foreignField: "user",
                as: "trainerDetails",
            },
        },
        {
            $lookup: {
                from: "trainees",
                localField: "_id",
                foreignField: "user",
                as: "traineeDetails",
            },
        },

        {
            $addFields: {
                userInfo: {
                    $arrayElemAt: [
                        { $concatArrays: ["$trainerDetails", "$traineeDetails"] },
                        0,
                    ],
                },
            },
        },
        {
            $project: {
                trainerDetails: 0,
                traineeDetails: 0,
            },
        },
    ]);

    return result;
};

const blockUnblock = async (id: string): Promise<any> => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(400, 'user does not exits')
    }
    const newStatus = user.status === "blocked" ? "in-progress" : "blocked";
    const uploadedStatus = {
        status: newStatus
    }

    const result = await User.findByIdAndUpdate({ _id: id }, uploadedStatus, { new: true })
    return {
        message: `user ${result?.status}`
    }
}

const checkTraineeNameAndEmail = async (userName: any, email: any): Promise<any> => {
    const userNameExist = await Trainee.findOne({ userName: userName })
    if (userNameExist) {
        return { userName: 'User Name already exists!' }
    }

    const isExist = await User.findOne({ email: email })
    if (isExist) {
        return { email: 'email already exists!' }
    }
}

const checkTrainerNameAndEmail = async (userName: any, email: any): Promise<any> => {
    const userNameExist = await Trainer.findOne({ userName: userName })
    if (userNameExist) {
        return { userName: 'User Name already exists!' }
    }

    const isExist = await User.findOne({ email: email })
    if (isExist) {
        return { email: 'email already exists!' }
    }
}


export const userServices = {
    createTrainee,
    createTrainer,
    getMe,
    viewUser,
    newUser,
    blockUnblock,
    checkTraineeNameAndEmail,
    checkTrainerNameAndEmail,
    // getMeTrainee,
}