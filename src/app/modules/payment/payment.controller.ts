import { NextFunction, Request, Response } from "express";
import { paymentServices } from "./payment.services";


const webhookService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        const result = await paymentServices.webhookService(req.body, sig, endpointSecret);

        res.status(200).json({
            success: true,
            message: 'webhook successfully',
            result,
        });
    } catch (error) {
        next(error);
    }
};

const generateOAuthLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainerId = req.query.trainerId;
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

const OnboardingComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { trainerId, accountId } = req.query;

        const result = await paymentServices.OnboardingComplete(trainerId, accountId);

        res.status(200).json({
            success: true,
            message: 'onboading done successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

// const createPayout = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { trainerStripeId, amount } = req.body

//         const result = await paymentServices.createPayout(trainerStripeId, amount);

//         res.status(200).json({
//             success: true,
//             message: 'Payout done successfully',
//             data: result,
//         })
//     }
//     catch (error) {
//         next(error)
//     }
// }


const checkStripeConnectedOrNot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { trainerId } = req.query

        const result = await paymentServices.checkStripeConnectedOrNot(trainerId);

        res.status(200).json({
            success: true,
            message: 'Checked Stripe Connected Or Not',
            connection: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const paymentController = {
    webhookService,
    generateOAuthLink,
    OnboardingComplete,
    // createPayout,
    checkStripeConnectedOrNot,
}