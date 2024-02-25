import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Product from "../models/product.model";
import Event from "../models/event.model";
import Order from "../models/order.model";
import Shop from "../models/shop.model";
import Withdraw from "../models/withdraw.model";
import Coupon from "../models/coupon.model";

// get user analytics
export const getUserAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(User);

        res.status(201).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get shop analytics
export const getShopAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(Shop);

        res.status(201).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get order analytics
export const getOrderAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(Order);

        res.status(201).json({
            success: true,
            orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get product analytics
export const getProductAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await generateLast12MonthsData(Product);

        res.status(201).json({
            success: true,
            products
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get event analytics
export const getEventAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await generateLast12MonthsData(Event);

        res.status(201).json({
            success: true,
            events
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get withdraw analytics
export const getWithdrawAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await generateLast12MonthsData(Withdraw);

        res.status(201).json({
            success: true,
            events
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get coupon analytics
export const getCouponAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await generateLast12MonthsData(Coupon);

        res.status(201).json({
            success: true,
            events
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});