import { NextFunction, Request, Response } from "express";
import { contentServices } from "./content.services";
import { contentValidatedSchema } from "./content.validation";

const createContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const user = req.user
        const data = JSON.parse(req.body.data)
        const content = contentValidatedSchema.parse(data)
        // console.log('file',file);
        // console.log('content',content);

        const result = await contentServices.createContent(file, content, user)
        res.status(200).json({
            success: true,
            message: 'content created successfully',
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

const getSingleContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await contentServices.getSingleContent(id)
        res.status(200).json({
            success: true,
            message: 'get single content successfully',
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

const getMyContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { limit, page, sortBy, sortOrder, searchTerm } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };

        const result = await contentServices.getMyContent(user,paginationOptions, searchTerm)
        res.status(200).json({
            success: true,
            message: 'get my content successfully',
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

const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { limit, page, sortBy, sortOrder, searchTerm, role, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };


        const result = await contentServices.getAllContent(paginationOptions,searchTerm as string,role, filters, user)
        res.status(200).json({
            success: true,
            message: 'get all content successfully',
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

const getAllContentForLogOutUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder, searchTerm, role, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };


        const result = await contentServices.getAllContentForLogOutUsers(paginationOptions,searchTerm as string,role, filters)
        res.status(200).json({
            success: true,
            message: 'get all content successfully',
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

const getAllForAdminContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { limit, page, sortBy, sortOrder, searchTerm, role, ...filters } = req.query;

        const paginationOptions = {
            limit: Number(limit) || 10,
            page: Number(page) || 1,
            sortBy: sortBy?.toString() || 'createdAt',
            sortOrder: sortOrder?.toString() === 'desc' ? 'desc' : 'asc',
        };
        console.log(paginationOptions);

        const result = await contentServices.getAllForAdminContent(paginationOptions,searchTerm as string,role, filters, user)
        res.status(200).json({
            success: true,
            message: 'get all content successfully',
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

const updateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file
        const id = req.params.id
        const user = req.user
        const data = JSON.parse(req.body.data? req.body.data : '{}')
        const content = data

        const result = await contentServices.updateContent(file, content, user, id)
        res.status(200).json({
            success: true,
            message: 'content updated successfully',
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

const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const user = req.user


        const result = await contentServices.deleteContent(id, user)
        res.status(200).json({
            success: true,
            message: 'content deleted successfully',
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

const blockUnblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await contentServices.blockUnblock(id)
        res.status(200).json({
            success: true,
            message: result.message,
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

export const contentController = {
    createContent,
    getSingleContent,
    getMyContent,
    getAllContentForLogOutUsers,
    getAllContent,
    getAllForAdminContent,
    updateContent,
    deleteContent,
    blockUnblock,
}