import { NextFunction, Request, Response } from "express"
import { followAndUnfollowServices } from "./follower.services"


const followAndUnfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await followAndUnfollowServices.followAndUnfollow(data)

        res.status(200).json({
            success: true,
            message: result?.message,
            data: result,
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

const getMyfollower = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await followAndUnfollowServices.getMyfollower(id)

        res.status(200).json({
            success: true,
            message: 'get follower successfully',
            data: result,
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

const getIAmFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await followAndUnfollowServices.getIAmFollowing(id)

        res.status(200).json({
            success: true,
            message: 'get who i am following successfully',
            data: result,
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


export const followAndUnfollowController = {
    followAndUnfollow,
    getMyfollower,
    getIAmFollowing,
}