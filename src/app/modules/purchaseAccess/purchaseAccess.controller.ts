import { NextFunction, Request, Response } from "express";
import { purchaseAccessServices } from "./purchaseAccess.services";


const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await purchaseAccessServices.checkEnrollment(data);

        res.status(200).json({
            success: true,
            message: 'checked successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const enrollNow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await purchaseAccessServices.enrollNow(data);

        res.status(200).json({
            success: true,
            message: 'enrollment successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const myEnrolledSesion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.user
        const result = await purchaseAccessServices.myEnrolledSesion(data);

        res.status(200).json({
            success: true,
            message: 'get my entrolled sessions successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getTotalEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await purchaseAccessServices.getTotalEnrollment(id);

        res.status(200).json({
            success: true,
            message: 'get enroll count successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getTotalEnrollmentForTrainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainerId = req.params.id
        const result = await purchaseAccessServices.getTotalEnrollmentForTrainer(trainerId);

        res.status(200).json({
            success: true,
            message: 'get total members of trainer successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const myMemberships = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const result = await purchaseAccessServices.myMemberships(user);

        res.status(200).json({
            success: true,
            message: 'get total myMemberships of trainee successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const markVideoAsComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        // const user = req.user
        // const id = req.params.id

        // console.log(id);
        const result = await purchaseAccessServices.markVideoAsComplete(data);

        res.status(200).json({
            success: true,
            message: 'mark as a complete successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const purchaseAccessController = {
    checkEnrollment,
    enrollNow,
    myEnrolledSesion,
    getTotalEnrollment,
    getTotalEnrollmentForTrainer,
    myMemberships,
    markVideoAsComplete,
}