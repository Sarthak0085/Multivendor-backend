"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponByAdmin = exports.getAllCouponsByAdmin = exports.getCouponByName = exports.deleteShopCouponById = exports.getAllCouponsByShopId = exports.createCoupon = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
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
exports.createCoupon = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const isCoupounCodeExists = await coupon_model_1.default.find({
            name: req.body.name,
        });
        if (isCoupounCodeExists.length !== 0) {
            return next(new ErrorHandler_1.default("Coupon code already exists!", 400));
        }
        const couponCode = await coupon_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            couponCode,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error, 400));
    }
});
// get all coupons of a shop
// router.get(
//     "/get-coupon/:id",
//     isSeller,
exports.getAllCouponsByShopId = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const couponCodes = await coupon_model_1.default.find({ shopId: req.params.shopId });
        res.status(201).json({
            success: true,
            couponCodes,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete coupoun code of a shop
// router.delete(
//     "/delete-coupon/:id",
//     isSeller,
exports.deleteShopCouponById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        const couponCode = await coupon_model_1.default.findByIdAndDelete(couponId);
        if (!couponCode) {
            return next(new ErrorHandler_1.default("Coupon code dosen't exists!", 400));
        }
        res.status(201).json({
            success: true,
            message: "Coupon code deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get coupon code value by its name
// router.get(
//     "/get-coupon-value/:name",
exports.getCouponByName = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const name = req.params.name;
        const couponCode = await coupon_model_1.default.findOne({ name });
        res.status(200).json({
            success: true,
            couponCode,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all coupons by admin
exports.getAllCouponsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const couponCode = await coupon_model_1.default.find().sort({
            createdAt: -1, updatedAt: -1
        });
        res.status(200).json({
            success: true,
            couponCode,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete coupon by admin
exports.deleteCouponByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        const couponCode = await coupon_model_1.default.findByIdAndDelete(couponId);
        if (!couponCode) {
            return next(new ErrorHandler_1.default("Coupon code dosen't exists!", 400));
        }
        res.status(201).json({
            success: true,
            message: "Coupon code deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
