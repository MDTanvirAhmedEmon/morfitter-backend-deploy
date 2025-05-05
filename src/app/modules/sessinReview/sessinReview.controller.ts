import { NextFunction, Request, Response } from "express"
import { sessionReviewServices } from "./sessinReview.services"

const giveReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await sessionReviewServices.giveReview(data)

        res.status(200).json({
            success: true,
            message: 'review given successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


const getAllReviewOfSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await sessionReviewServices.getAllReviewOfSession(id)

        res.status(200).json({
            success: true,
            message: 'get all review of a session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}



export const sessionReviewController = {
    giveReview,
    getAllReviewOfSession,
}