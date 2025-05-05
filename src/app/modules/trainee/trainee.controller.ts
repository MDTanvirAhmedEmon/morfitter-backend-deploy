import { NextFunction, Request, Response } from "express";
import { traineeServices } from "./trainee.services";
import { IPaginationOptions } from "../../global/globalType";

const getAllTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm } = req.query;

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await traineeServices.getAllTrainee(paginationOptions, searchTerm);

        res.status(200).json({
            success: true,
            message: 'get all trainee successfully',
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

const updateTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req?.file
        const userId = req.user
        const id = req.params.id
        // const user = req.user
        const { trainee, user } = JSON.parse(req.body.data)
        const result = await traineeServices.updateTrainee(file, id, trainee, user, userId);

        res.status(200).json({
            success: true,
            message: 'trainee updated successfully',
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


const getAllForAdminTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await traineeServices.getAllForAdminTrainee(paginationOptions, searchTerm, filters);

        res.status(200).json({
            success: true,
            message: 'get all trainer successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getTraineesByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traineeServices.getTraineesByMonth();

        res.status(200).json({
            success: true,
            message: 'get users successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

export const traineeController = {
    getAllTrainee,
    updateTrainee,
    getAllForAdminTrainee,
    getTraineesByMonth,
}

