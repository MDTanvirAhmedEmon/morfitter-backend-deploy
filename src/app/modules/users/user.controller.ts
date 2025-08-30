import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import { userValidationSchema } from "./user.validation";
import { traineeValidatedSchema } from "../trainee/trainee.validation";
import { trainerValidatedSchema } from "../trainer/trainer.validation";
import config from "../../config";


const createTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const data = JSON.parse(req.body.data)
        const { userInfo, traineeData } = data;

        const validateUserInfo = userValidationSchema.parse(userInfo)
        const validateTraineeData = traineeValidatedSchema.parse(traineeData)
        const result = await userServices.createTrainee(validateUserInfo, validateTraineeData, file);
        const { refreshToken, ...others } = result
        const cookieOptions = {
            secure: config.node_env === 'production',
            httpOnly: false,
        }

        res.cookie('refreshToken', refreshToken, cookieOptions)
        res.status(200).json({
            success: true,
            message: 'trainee created successfully',
            data: others,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}

const createTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const data = JSON.parse(req.body.data)
        const specialism = data.specialism
        const { userInfo, trainerData } = data.register;

        const validateUserInfo = userValidationSchema.parse(userInfo)
        const validateTrainerData = trainerValidatedSchema.parse(trainerData)
        const result = await userServices.createTrainer(validateUserInfo, validateTrainerData, file, specialism);
        const { refreshToken, ...others } = result
        const cookieOptions = {
            secure: config.node_env === 'production',
            httpOnly: false,
        }

        res.cookie('refreshToken', refreshToken, cookieOptions)
        res.status(200).json({
            success: true,
            message: 'trainer created successfully',
            data: others,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const result = await userServices.getMe(user);
        res.status(200).json({
            success: true,
            message: 'get my data successfully',
            data: result,
        })

    }
    catch (error) {
        next(error)
    }
}

const viewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        console.log(user);
        const id = req.params.id
        const result = await userServices.viewUser(id, user);
        res.status(200).json({
            success: true,
            message: 'get single user successfully',
            data: result,
        })

    }
    catch (error) {
        next(error)
    }
}

const newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await userServices.newUser();
        res.status(200).json({
            success: true,
            message: 'get new users successfully',
            data: result,
        })

    }
    catch (error) {
        next(error)
    }
}

const blockUnblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await userServices.blockUnblock(id);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        })

    }
    catch (error) {
        next(error)
    }
}

// const getMeTrainee = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = req.user;
//         console.log(user);
//         const result = await userServices.getMeTrainee(user);
//         res.status(200).json({
//             success: true,
//             message: 'get my data successfully',
//             data: result,
//         })
//         // sendResponse(res, {
//         //     statusCode: httpStatus.OK,
//         //     success: true,
//         //     message: 'user created successfully',
//         //     data: result,
//         // });
//     }
//     catch (error) {
//         next(error)
//     }
// }
const checkUserNameAndEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, email } = req.body

        const result = await userServices.checkUserNameAndEmail(userName, email);

        res.status(200).json({
            success: true,
            message: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const userController = {
    createTrainee,
    createTrainer,
    getMe,
    viewUser,
    newUser,
    blockUnblock,
    checkUserNameAndEmail
    // getMeTrainee,
}