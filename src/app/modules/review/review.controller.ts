import { NextFunction, Request, Response } from "express"
import { reviewServices } from "./review.services"


const giveReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await reviewServices.giveReview(data)

        res.status(200).json({
            success: true,
            message: 'review given successfully',
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

const getReviewOfTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await reviewServices.getReviewOfTrainer(id)

        res.status(200).json({
            success: true,
            message: 'get all review successfully',
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


export const reviewController = {
    giveReview,
    getReviewOfTrainer,
}