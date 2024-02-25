import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import stripePackage from 'stripe';
import ErrorHandler from "../utils/ErrorHandler";

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY as string);

export const processPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // Check if the amount is provided in the request body

    const { amount } = req.body

    if (!amount) {
        return next(new ErrorHandler("Amount is required", 400));
    }

    if (isNaN(Number(amount)) || amount <= 0) {
        return next(new ErrorHandler("Invalid Amount", 400));
    }

    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            metadata: {
                company: "TrendFlex",
            },
        });
        res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    } catch (error: any) {
        console.error('Error processing payment:', error);
        return next(new ErrorHandler(error.message, 500))
    }
});


export const getStripeApiKey = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_PUBLISHABLE_KEY });
});