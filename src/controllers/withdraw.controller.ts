import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import sendEmail from "../utils/sendMail";
import Withdraw from "../models/withdraw.model";
import Shop from "../models/shop.model";
import ErrorHandler from "../utils/ErrorHandler";

// const Shop = require("../model/shop");
// const ErrorHandler = require("../utils/ErrorHandler");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const express = require("express");
// const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
// const Withdraw = require("../model/withdraw");
// const sendMail = require("../utils/sendMail");
// const router = express.Router();

// create withdraw request --- only for seller
// router.post(
//     "/create-withdraw-request",
//     isSeller,
export const createWithdrawRequest = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { amount } = req.body;

            const data = {
                seller: req.seller,
                amount,
            };

            // try {
            //     await sendEmail({
            //         email: req.seller.email,
            //         subject: "Withdraw Request",
            //         message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
            //     });
            //     res.status(201).json({
            //         success: true,
            //     });
            // } catch (error:any) {
            //     return next(new ErrorHandler(error.message, 500));
            // }

            const withdraw = await Withdraw.create(data);

            const shop = await Shop.findById(req.seller._id);

            if (!shop) {
                return next(new ErrorHandler("Shop not found", 404));
            }

            if (shop.availableBalance !== undefined) {
                shop.availableBalance = shop.availableBalance - amount;
                await shop.save();
                res.status(201).json({
                    success: true,
                    withdraw,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get all withdraws --- admnin

// router.get(
//     "/get-all-withdraw-request",
//     isAuthenticated,
//     isAdmin("Admin"),
export const getAllWithdrawRequestByAdmin = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const withdraws = await Withdraw.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                withdraws,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update withdraw request ---- admin
// router.put(
//     "/update-withdraw-request/:id",
//     isAuthenticated,
//     isAdmin("Admin"),
export const updateWithdrawRequestByAdmin = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sellerId } = req.body;
            const withdrawId = req.params.id;
            const withdraw = await Withdraw.findByIdAndUpdate(
                withdrawId,
                {
                    status: "succeed",
                    updatedAt: Date.now(),
                },
                { new: true }
            );

            if (!withdraw) {
                return next(new ErrorHandler("Withdraw Request not found", 404));
            }

            const shop = await Shop.findById(sellerId);

            if (!shop) {
                return next(new ErrorHandler("Shop not found", 404));
            }

            const transaction = {
                _id: withdraw._id,
                amount: withdraw.amount,
                updatedAt: withdraw.updatedAt,
                status: withdraw.status,
            };

            shop.transactions = [...shop.transactions, transaction];

            await shop.save();

            // try {
            //     await sendEMail({
            //         email: seller.email,
            //         subject: "Payment confirmation",
            //         message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3 days to 7 days.`,
            //     });
            // } catch (error) {
            //     return next(new ErrorHandler(error.message, 500));
            // }
            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
