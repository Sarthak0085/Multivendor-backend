"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCouponAnalytics = exports.getWithdrawAnalytics = exports.getEventAnalytics = exports.getProductAnalytics = exports.getOrderAnalytics = exports.getShopAnalytics = exports.getUserAnalytics = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
const withdraw_model_1 = __importDefault(require("../models/withdraw.model"));
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
// get user analytics
exports.getUserAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await (0, analytics_generator_1.generateLast12MonthsData)(user_model_1.default);
        res.status(201).json({
            success: true,
            users
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get shop analytics
exports.getShopAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await (0, analytics_generator_1.generateLast12MonthsData)(shop_model_1.default);
        res.status(201).json({
            success: true,
            users
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get order analytics
exports.getOrderAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const orders = await (0, analytics_generator_1.generateLast12MonthsData)(order_model_1.default);
        res.status(201).json({
            success: true,
            orders
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get product analytics
exports.getProductAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await (0, analytics_generator_1.generateLast12MonthsData)(product_model_1.default);
        res.status(201).json({
            success: true,
            products
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get event analytics
exports.getEventAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const events = await (0, analytics_generator_1.generateLast12MonthsData)(event_model_1.default);
        res.status(201).json({
            success: true,
            events
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get withdraw analytics
exports.getWithdrawAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const events = await (0, analytics_generator_1.generateLast12MonthsData)(withdraw_model_1.default);
        res.status(201).json({
            success: true,
            events
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get coupon analytics
exports.getCouponAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const events = await (0, analytics_generator_1.generateLast12MonthsData)(coupon_model_1.default);
        res.status(201).json({
            success: true,
            events
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
