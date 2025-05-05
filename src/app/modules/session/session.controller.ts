import { NextFunction, Request, Response } from "express"
import { trainingSessionValidatedSchema } from "./session.validation"
import { sessionServices } from "./session.services"
import AppError from "../../errors/AppError";


const createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const image = files.image?.[0];
        const video = files.video?.[0];

        if (!image || !video) {
            throw new Error("Both image and video files are required.");
        }
        const user = req.user
        const data = JSON.parse(req.body.data)
        const content = trainingSessionValidatedSchema.parse(data)
        // console.log('file',file);
        // console.log('content',content);

        const result = await sessionServices.createSession(image, video, user, content)
        res.status(200).json({
            success: true,
            message: 'session created successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const updateSessionDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const image = files.image?.[0];
        const video = files.video?.[0];
        const id = req.params.id
        const content = JSON.parse(req.body.data)

        const result = await sessionServices.updateSessionDetails(id, image, video, content)
        res.status(200).json({
            success: true,
            message: 'session updated successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getAllSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'desc',
        };

        const result = await sessionServices.getAllSession(paginationOptions, searchTerm as string , filters)
        res.status(200).json({
            success: true,
            message: 'get all session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getAllSessionForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'desc',
        };

        const result = await sessionServices.getAllSessionForAdmin(paginationOptions, searchTerm as string , filters)
        res.status(200).json({
            success: true,
            message: 'get all session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const user = req.user
        const id = req.params.id
        const content = JSON.parse(req.body.data)

        const result = await sessionServices.updateSession(id,file, user, content)
        res.status(200).json({
            success: true,
            message: 'session updated successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


const getMySession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, ...filters } = req.query;
        const trainerId = req.params.id

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'desc',
        };

        const result = await sessionServices.getMySession(trainerId ,paginationOptions, searchTerm as string , filters)
        res.status(200).json({
            success: true,
            message: 'get my session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getSingleSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        if (!req.user) {
            throw new AppError(401,"User is not authenticated.");
        }
        const userId = req.user.id;
        const result = await sessionServices.getSingleSession(id, userId)
        res.status(200).json({
            success: true,
            message: 'get single session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getSingleForAdminSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await sessionServices.getSingleForAdminSession(id)
        res.status(200).json({
            success: true,
            message: 'get single session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteSessionContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await sessionServices.deleteSessionContent(data)
        res.status(200).json({
            success: true,
            message: 'deleted session video successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteWholeSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await sessionServices.deleteWholeSession(id)
        res.status(200).json({
            success: true,
            message: 'deleted session successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const blockUnblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await sessionServices.blockUnblock(id)
        res.status(200).json({
            success: true,
            message: 'session status updated successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

export const sessionController = {
    createSession,
    getAllSession,
    getAllSessionForAdmin,
    updateSessionDetails,
    updateSession,
    getMySession,
    getSingleSession,
    getSingleForAdminSession,
    deleteSessionContent,
    deleteWholeSession,
    blockUnblock,
}