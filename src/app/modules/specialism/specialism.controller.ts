import { NextFunction, Request, Response } from "express";
import { specialismServices } from "./specialism.services";



const createSpecialism = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const data = req.body

        const result = await specialismServices.createSpecialism(id, data);

        res.status(200).json({
            success: true,
            message: 'specialism updated successfully',
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


const getAllOfUserSpecialism = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await specialismServices.getAllOfUserSpecialism(id);

        res.status(200).json({
            success: true,
            message: 'get all specialism of a trainer successfully',
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

const deleteSpecialism = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await specialismServices.deleteSpecialism(id);

        res.status(200).json({
            success: true,
            message: 'deleted specialism successfully',
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

export const specialismController = {
    createSpecialism,
    getAllOfUserSpecialism,
    deleteSpecialism,
}