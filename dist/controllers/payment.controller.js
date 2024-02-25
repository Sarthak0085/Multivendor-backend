"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeApiKey = exports.processPayment = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const stripe_1 = __importDefault(require("stripe"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.processPayment = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    // Check if the amount is provided in the request body
    const { amount } = req.body;
    if (!amount) {
        return next(new ErrorHandler_1.default("Amount is required", 400));
    }
    if (isNaN(Number(amount)) || amount <= 0) {
        return next(new ErrorHandler_1.default("Invalid Amount", 400));
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
    }
    catch (error) {
        console.error('Error processing payment:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getStripeApiKey = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_PUBLISHABLE_KEY });
});
