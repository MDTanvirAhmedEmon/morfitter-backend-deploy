import { NextFunction, Request, Response } from "express";
import { paymentServices } from "./payment.services";


const webhookService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        const result = await paymentServices.webhookService(req.body, sig, endpointSecret);

        res.status(200).json({
            success: true,
            message: 'webhook successful',
            result,
        });
    } catch (error) {
        next(error);
    }
};

const generateOAuthLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainerId = req.query.id;
        const email = req.query.email;
        const result = await paymentServices.generateOAuthLink(trainerId, email as string);

        res.status(200).json({
            success: true,
            message: 'get OAuth link successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

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

const createPayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { trainerStripeId, amount } = req.body

        const result = await paymentServices.createPayout(trainerStripeId, amount);

        res.status(200).json({
            success: true,
            message: 'Payout done successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const paymentController = {
    webhookService,
    generateOAuthLink,
    makePayment,
    createPayout,
}