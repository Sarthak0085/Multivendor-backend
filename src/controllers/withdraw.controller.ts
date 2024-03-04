import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import sendEmail from "../utils/sendMail";
import Withdraw from "../models/withdraw.model";
import Shop from "../models/shop.model";
import ErrorHandler from "../utils/ErrorHandler";

export const createWithdrawRequest = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { amount } = req.body;
            console.log("amount :", req.body, amount);
            const data = {
                seller: req.seller,
                amount: amount,
            };

            const withdraw = await Withdraw.create(data);

            const shop = await Shop.findById(req.seller._id);

            if (!shop) {
                return next(new ErrorHandler("Shop not found", 404));
            }

            if (shop.availableBalance !== undefined) {
                shop.availableBalance = shop.availableBalance - amount;
                await shop.save();

                const data1 = { seller: { name: shop.name }, amount };

                try {
                    await sendEmail({
                        email: shop.email,
                        subject: "Withdraw Request",
                        template: "withdrawRequest.ejs",
                        data: data1,
                    });

                    res.status(201).json({
                        success: true,
                        withdraw,
                    });

                } catch (error: any) {
                    return next(new ErrorHandler(error.message, 400));
                };
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get all withdraws --- admnin
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

// update withdraw request by admin
export const updateWithdrawRequestByAdmin = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shopId, withdrawStatus } = req.body;
            const withdrawId = req.params.id;
            console.log(shopId, withdrawStatus, withdrawId);

            const withdraw = await Withdraw.findByIdAndUpdate(
                withdrawId,
                {
                    status: withdrawStatus,
                    updatedAt: Date.now(),
                },
                { new: true }
            );

            if (!withdraw) {
                return next(new ErrorHandler("Withdraw Request not found", 404));
            }

            const shop = await Shop.findById(shopId);

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

            const data = { seller: { name: shop.name }, withdraw: { amount: withdraw.amount } };

            try {
                await sendEmail({
                    email: shop.email,
                    subject: "Withdraw Success",
                    template: "withdrawSuccess.ejs",
                    data
                });


                res.status(201).json({
                    success: true,
                    withdraw,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            };

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
