"use strict";
// import ErrorHandler from "../utils/ErrorHandler.js";
// import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
// import Order from "../model/order.js";
// import Shop from "../model/shop.js";
// import Product from "../model/product.js";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersByAdmin = exports.orderRefundSuccess = exports.orderRefundRequest = exports.updateOrderStatus = exports.getAllOrdersByShopId = exports.getAllOrderByUserId = exports.createOrder = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const order_model_1 = __importDefault(require("../models/order.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const product_model_1 = __importDefault(require("../models/product.model"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
// create new order
exports.createOrder = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { cart, shippingAddress, user, userId, totalPrice, paymentInfo } = req.body;
        const shopItemsMap = new Map();
        for (const item of cart.products) {
            const shopId = item.shopId;
            if (!shopItemsMap.has(shopId)) {
                shopItemsMap.set(shopId, []);
            }
            shopItemsMap.get(shopId).push(item);
        }
        const orders = [];
        for (const [shopId, items] of shopItemsMap) {
            const order = await order_model_1.default.create({
                cart: items,
                shippingAddress,
                user,
                userId,
                totalPrice,
                paymentInfo,
            });
            orders.push(order);
        }
        res.status(201).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all orders of user
exports.getAllOrderByUserId = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const orders = await order_model_1.default.find({ userId })
            .sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all orders of seller
exports.getAllOrdersByShopId = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopId = req.params.shopId;
        const orders = await order_model_1.default.find({})
            .sort({
            createdAt: 1, updatedAt: 1,
        });
        console.log(shopId);
        const ordersForShop = orders.filter(order => {
            return order.cart.some((item) => item[0].product.shopId === shopId);
        });
        const shopOrders = ordersForShop.map(order => ({
            cart: order.cart.filter((item) => item[0].product.shopId === shopId),
            _id: order._id,
            shippingAddress: order.shippingAddress,
            user: order.user,
            userId: order.userId,
            status: order.status,
            totalPrice: order.totalPrice,
            paymentInfo: order.paymentInfo,
            paidAt: order.paidAt,
            createdAt: order.createdAt,
        }));
        console.log(orders);
        res.status(200).json({
            success: true,
            orders: shopOrders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update order status for seller
exports.updateOrderStatus = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        if (req.body.status === "Transferred to delivery partner") {
            order.cart.forEach(async (o) => {
                await updateOrder(o?._id, o?.qty);
            });
        }
        order.status = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = new Date(Date.now());
            order.paymentInfo.status = "Succeeded";
            const serviceCharge = order.totalPrice * .10;
            await updateSellerInfo(order.totalPrice - serviceCharge);
        }
        await order.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            order,
        });
        async function updateOrder(id, qty) {
            const product = await product_model_1.default.findById(id);
            if (!product) {
                return next(new ErrorHandler_1.default("Product not found", 404));
            }
            product.stock -= qty;
            product.sold_out += qty;
            await product.save({ validateBeforeSave: false });
        }
        async function updateSellerInfo(amount) {
            const seller = await shop_model_1.default.findById(req.seller._id);
            if (!seller) {
                return next(new ErrorHandler_1.default("Seller/Shop not found", 404));
            }
            seller.availableBalance = amount;
            await seller.save();
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// give a refund ----- user
exports.orderRefundRequest = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found with this id", 400));
        }
        order.status = status;
        await order.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            order,
            message: "Order Refund Request successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// accept the refund ---- seller
exports.orderRefundSuccess = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { status } = req.body;
        const orderId = req.params.orderId;
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found with this id", 400));
        }
        order.status = status;
        await order.save();
        res.status(200).json({
            success: true,
            message: "Order Refund successful!",
        });
        if (req.body.status === "Refund Success") {
            order.cart.forEach(async (o) => {
                await updateOrder(o._id, o.qty);
            });
        }
        async function updateOrder(id, qty) {
            const product = await product_model_1.default.findById(id);
            if (!product) {
                return next(new ErrorHandler_1.default("Product not found", 404));
            }
            else {
                product.stock += qty;
                product.sold_out += qty;
                await product.save({ validateBeforeSave: false });
            }
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// all orders --- for admin
exports.getAllOrdersByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const orders = await order_model_1.default.find().sort({
            createdAt: -1, updatedAt: -1,
        });
        res.status(201).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
