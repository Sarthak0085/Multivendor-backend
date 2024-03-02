"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWithdrawRequestByAdmin = exports.getAllWithdrawRequestByAdmin = exports.createWithdrawRequest = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const withdraw_model_1 = __importDefault(require("../models/withdraw.model"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
exports.createWithdrawRequest = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
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
        const withdraw = await withdraw_model_1.default.create(data);
        const shop = await shop_model_1.default.findById(req.seller._id);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        if (shop.availableBalance !== undefined) {
            shop.availableBalance = shop.availableBalance - amount;
            await shop.save();
            res.status(201).json({
                success: true,
                withdraw,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get all withdraws --- admnin
// router.get(
//     "/get-all-withdraw-request",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.getAllWithdrawRequestByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const withdraws = await withdraw_model_1.default.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            withdraws,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update withdraw request ---- admin
// router.put(
//     "/update-withdraw-request/:id",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.updateWithdrawRequestByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { sellerId } = req.body;
        const withdrawId = req.params.id;
        const withdraw = await withdraw_model_1.default.findByIdAndUpdate(withdrawId, {
            status: "succeed",
            updatedAt: Date.now(),
        }, { new: true });
        if (!withdraw) {
            return next(new ErrorHandler_1.default("Withdraw Request not found", 404));
        }
        const shop = await shop_model_1.default.findById(sellerId);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
