import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Coupon from "../models/coupon.model";
import ErrorHandler from "../utils/ErrorHandler";

// const express = require("express");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const Shop = require("../model/shop");
// const ErrorHandler = require("../utils/ErrorHandler");
// const { isSeller } = require("../middleware/auth");
// const CoupounCode = require("../model/coupounCode");
// const router = express.Router();

// interface ICreateCoupon {

// }

// create coupoun code
// router.post(
//     "/create-coupon-code",
//     isSeller,
export const createCoupon = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCoupounCodeExists = await Coupon.find({
            name: req.body.name as string,
        });

        if (isCoupounCodeExists.length !== 0) {
            return next(new ErrorHandler("Coupon code already exists!", 400));
        }

        const couponCode = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            couponCode,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

// get all coupons of a shop
// router.get(
//     "/get-coupon/:id",
//     isSeller,
export const getAllCouponsByShopId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponCodes = await Coupon.find({ shopId: req.params.shopId });
        res.status(201).json({
            success: true,
            couponCodes,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete coupoun code of a shop
// router.delete(
//     "/delete-coupon/:id",
//     isSeller,
export const deleteShopCouponById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.couponId as string;
        const couponCode = await Coupon.findByIdAndDelete(couponId);

        if (!couponCode) {
            return next(new ErrorHandler("Coupon code dosen't exists!", 400));
        }
        res.status(201).json({
            success: true,
            message: "Coupon code deleted successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// get coupon code value by its name
// router.get(
//     "/get-coupon-value/:name",
export const getCouponByName = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name as string;
        const couponCode = await Coupon.findOne({ name });

        res.status(200).json({
            success: true,
            couponCode,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all coupons by admin
export const getAllCouponsByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponCode = await Coupon.find().sort({
            createdAt: -1, updatedAt: -1
        });

        res.status(200).json({
            success: true,
            couponCode,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete coupon by admin
export const deleteCouponByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.couponId as string;
        const couponCode = await Coupon.findByIdAndDelete(couponId);

        if (!couponCode) {
            return next(new ErrorHandler("Coupon code dosen't exists!", 400));
        }
        res.status(201).json({
            success: true,
            message: "Coupon code deleted successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});