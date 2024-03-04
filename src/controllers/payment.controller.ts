import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import stripePackage from 'stripe';
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.model";
import sendEmail from "../utils/sendMail";

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY as string);

export const processPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount } = req.body

        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (!amount) {
            return next(new ErrorHandler("Amount is required", 400));
        }

        if (isNaN(Number(amount)) || amount <= 0) {
            return next(new ErrorHandler("Invalid Amount", 400));
        }
        const myPayment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            metadata: {
                company: "TrendFlex",
            },
        });

        const data = { user: { name: user.fullName }, amount };

        try {
            await sendEmail({
                email: user.email,
                subject: "Payment Success",
                template: "paymentSuccess.ejs",
                data
            });


            res.status(200).json({
                success: true,
                client_secret: myPayment.client_secret,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        };
    } catch (error: any) {
        console.error('Error processing payment:', error);
        return next(new ErrorHandler(error.message, 500))
    }
});


export const getStripeApiKey = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_PUBLISHABLE_KEY });
});