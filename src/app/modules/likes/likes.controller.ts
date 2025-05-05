import { NextFunction, Request, Response } from "express";
import { likesServices } from "./likes.services";


const likeDisLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await likesServices.likeDisLike(data);

            res.status(200).json({
                success: true,
                message: 'like updated successfully',
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


export const likesController = {
    likeDisLike,
}