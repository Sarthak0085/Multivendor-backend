"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeApiKey = exports.processPayment = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const stripe_1 = __importDefault(require("stripe"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.processPayment = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { amount } = req.body;
        const user = await user_model_1.default.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        if (!amount) {
            return next(new ErrorHandler_1.default("Amount is required", 400));
        }
        if (isNaN(Number(amount)) || amount <= 0) {
            return next(new ErrorHandler_1.default("Invalid Amount", 400));
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
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Payment Success",
                template: "paymentSuccess.ejs",
                data
            });
            res.status(200).json({
                success: true,
                client_secret: myPayment.client_secret,
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
        ;
    }
    catch (error) {
        console.error('Error processing payment:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getStripeApiKey = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_PUBLISHABLE_KEY });
});
