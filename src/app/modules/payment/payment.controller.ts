import { NextFunction, Request, Response } from "express";
import { paymentServices } from "./payment.services";


const makePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await paymentServices.makePayment(data);

        res.status(200).json({
            success: true,
            message: 'payment done successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const executePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await paymentServices.executePayment(data);

        res.status(200).json({
            success: true,
            message: 'execute payment done successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const paymentController = {
    makePayment,
    executePayment,
}