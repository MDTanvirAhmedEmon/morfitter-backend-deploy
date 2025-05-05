import { NextFunction, Request, Response } from 'express';
import { invitationServices } from './invitation.services';
import { IPaginationOptions } from '../../global/globalType';

const sentInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await invitationServices.sentInvitation(data)

        res.status(200).json({
            success: true,
            message: 'sent invitation successfully',
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

const getAllTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm } = req.query;
        const trainer_id = req.params.id
        console.log(trainer_id);

        const paginationOptions: IPaginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await invitationServices.getAllTrainee(paginationOptions, searchTerm, trainer_id);

        res.status(200).json({
            success: true,
            message: 'get trainee successfully',
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

const getMyInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainee_id = req.params.id
        const result = await invitationServices.getMyInvitation(trainee_id)

        res.status(200).json({
            success: true,
            message: 'get my invitation successfully',
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

const rejectInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await invitationServices.rejectInvitation(id)

        res.status(200).json({
            success: true,
            message: 'reject invitation successfully',
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


export const invitationController = {
    sentInvitation,
    getAllTrainee,
    getMyInvitation,
    rejectInvitation,
}