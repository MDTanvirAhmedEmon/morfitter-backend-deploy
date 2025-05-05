import AppError from "../../errors/AppError";
import paypal from "paypal-rest-sdk";

const makePayment = async (data: any) => {

    paypal.configure({
        mode: "sandbox", // Change to 'sandbox' for testing. for production "live"
        client_id: process.env.PAYPAL_CLIENT_ID!, // make sure to change this from config
        client_secret: process.env.PAYPAL_SECRET!,
    });


    const { trainerPaypalEmail, sessionPrice } = data;

    // Calculate admin commission (10%) and trainer payout (90%)
    const adminCommission = (sessionPrice * 0.10).toFixed(2);
    const trainerPayout = (sessionPrice * 0.90).toFixed(2);

    const create_payment_json:any = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        transactions: [
            {
                amount: {
                    total: sessionPrice.toFixed(2),
                    currency: "USD",
                },
                payee: {
                    email: process.env.ADMIN_PAYPAL_EMAIL, // Admin receives full amount first
                },
                description: "Payment for Trainer Session",
            },
        ],
        redirect_urls: {
            return_url: "http://yourdomain.com/api/paypal/success",
            cancel_url: "http://yourdomain.com/api/paypal/cancel",
        },
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            throw new AppError(400, error.message)
        } else {
            const approvalUrl = payment.links?.find((link) => link.rel === "approval_url")?.href;
            return { approvalUrl }
        }
    });
}

const executePayment = async (data: any) => {
    const { paymentId, PayerID, trainerPaypalEmail, sessionPrice } = data;

    const execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    total: sessionPrice.toFixed(2),
                    currency: "USD",
                },
            },
        ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            throw new AppError(400, error.message)
        } else {
            // Trigger payout to trainer
            await sendPayout(trainerPaypalEmail, (sessionPrice * 0.90).toFixed(2));
            return { message: "Payment successful!" }
        }
    });
};

// Payout function to send 90% to the trainer
const sendPayout = async (trainerPaypalEmail: any, amount: any) => {
    const payoutJson = {
        sender_batch_header: {
            email_subject: "Trainer Payout",
        },
        items: [
            {
                recipient_type: "EMAIL",
                amount: {
                    currency: "USD",
                    value: amount,
                },
                receiver: trainerPaypalEmail,
            },
        ],
    };

    paypal.payout.create(payoutJson, (error:any, payout:any) => {
        if (error) {
            console.error("Payout Error:", error);
        } else {
            console.log("Payout Successful:", payout);
        }
    });
};




export const paymentServices = {
    makePayment,
    executePayment,
};
