import Stripe from 'stripe';
import config from '../../config';
import { PurchaseAccess } from '../purchaseAccess/purchaseAccess.model';
import { Trainer } from '../trainer/trainer.model';
import AppError from '../../errors/AppError';

const stripe = new Stripe(config.stripe_secret_key!, {
    apiVersion: '2025-06-30.basil',
});

const webhookService = async (body: Buffer, sig: any, endpointSecret: string) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        // console.error('Webhook Error:', err.message);
        // return res.status(400).send(`Webhook Error: ${err.message}`);
        throw new AppError(400, "webhook Error")
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // const paymentIntentId = session.payment_intent;
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const purchase = await PurchaseAccess.findOneAndUpdate(
            { purchase_session_id: session.id },
            {
                paymentStatus: 'paid',
                // paymentDetails: { transactionId: paymentIntent.charges.data[0].id, },
            }
        );

    }

    return { received: true };
}

const generateOAuthLink = async (trainerId: any, email: string) => {
    try {
        // Create an Express account
        const account = await stripe.accounts.create({
            type: 'standard',
            country: 'GB',
            email: email,
        });

        const trainer = await Trainer.findById({ _id: trainerId })
        if (!trainer) {
            throw new AppError(400, "Trainer not found!")
        } else {
            await Trainer.findByIdAndUpdate({ _id: trainerId }, { stripeAccountId: account.id })
        }
        // Create an onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            // account: '',
            refresh_url: 'https://morfitter.com',
            return_url: 'https://morfitter.com',
            type: 'account_onboarding',
        });

        return accountLink.url;
    } catch (error) {
        console.error('Error generating Stripe OAuth link:', error);
        // throw new AppError(500, error?.raw?.message);
        throw new AppError(500, "Something went wrong");
    }
};


const createPayout = async (trainerStripeId: string, amount: number) => {
    try {
        // Calculate the amount in the smallest unit (e.g., cents for USD)
        const amountInCents = Math.floor(amount * 100);

        // Create a payout
        const payout = await stripe.payouts.create(
            {
                amount: amountInCents, // Amount to payout (in cents)
                currency: 'gbp', // Currency
            },
            {
                stripeAccount: trainerStripeId, // The trainer's Stripe Connect account ID
            }
        );

        console.log('Payout created successfully:', payout);
        return payout;
    } catch (error) {
        console.error('Error creating payout:', error);
        throw new Error('Failed to create payout');
    }
};


export const paymentServices = {
    webhookService,
    generateOAuthLink,
    createPayout,
};
