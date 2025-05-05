import { NextFunction, Request, Response } from "express";
import { trainerServices } from "./trainer.services";
import { IPaginationOptions } from "../../global/globalType";

const updateTriner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req?.file
        // console.log(file);
        const userId = req.user
        const id = req.params.id
        // const user = req.user
        const { trainer, user } = JSON.parse(req.body.data)

        const result = await trainerServices.updateTrainer(file, id, trainer, user, userId);

        res.status(200).json({
            success: true,
            message: 'trainer updated successfully',
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

const getAllTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await trainerServices.getAllTrainer(paginationOptions, searchTerm, filters);

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

const getAllForAdminTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await trainerServices.getAllForAdminTrainer(paginationOptions, searchTerm, filters);

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

const getTrainersByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await trainerServices.getTrainersByMonth();

        res.status(200).json({
            success: true,
            message: 'get trainers successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getSingleTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await trainerServices.getSingleTrainer(id);

        res.status(200).json({
            success: true,
            message: 'get single trainer successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

export const trainerController = {
    updateTriner,
    getAllTrainer,
    getTrainersByMonth,
    getAllForAdminTrainer,
    getSingleTrainer,
}

