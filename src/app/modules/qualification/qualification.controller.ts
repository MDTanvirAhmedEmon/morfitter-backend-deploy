import { NextFunction, Request, Response } from "express";
import { qualificationServices } from "./qualification.services";



const createQualification= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const data = req.body

        const result = await qualificationServices.createQualification(id, data);

        res.status(200).json({
            success: true,
            message: 'qualification updated successfully',
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


const getAllOfUserQualification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await qualificationServices.getAllOfUserQualification(id);

        res.status(200).json({
            success: true,
            message: 'get all qualification of a trainer successfully',
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

const deleteQualification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await qualificationServices.deleteQualification(id);

        res.status(200).json({
            success: true,
            message: 'removed qualification successfully',
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

export const qualificationController = {
    createQualification,
    getAllOfUserQualification,
    deleteQualification,
}