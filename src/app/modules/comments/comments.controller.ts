import { NextFunction, Request, Response } from "express";
import { commentsServices } from "./comments.services";


const doComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const user = req.user;

        const result = await commentsServices.doComment(data, user);

            res.status(200).json({
                success: true,
                message: 'commnet done successfully',
                data: result,
            })
    }
    catch (error) {
        next(error)
    }
}

const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const id = req.params.id

        const result = await commentsServices.getAllComments(id);

            res.status(200).json({
                success: true,
                message: 'get content commnets successfully',
                data: result,
            })
    }
    catch (error) {
        next(error)
    }
}

const deleteMyComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const id = req.params.id

        const result = await commentsServices.deleteMyComment(id, user);

            res.status(200).json({
                success: true,
                message: 'deleted commnet successfully',
                data: result,
            })
    }
    catch (error) {
        next(error)
    }
}


export const commentsController = {
    doComment,
    getAllComments,
    deleteMyComment,
}