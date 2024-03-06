import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Order from "../models/order.model";
import ErrorHandler from "../utils/ErrorHandler";
import Product from "../models/product.model";
import Shop from "../models/shop.model";
import { IProductInCart } from "../models/cart.model";
import sendEmail from "../utils/sendMail";

// create new order
export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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
            const order = await Order.create({
                cart: items,
                shippingAddress,
                user,
                userId,
                totalPrice,
                paymentInfo,
            });
            orders.push(order);
        }

        const data1 = { user: { name: user.name } };

        try {
            await sendEmail({
                email: user.email,
                subject: "Order Success",
                template: "createOrderMail.ejs",
                data: data1,
            });

            res.status(201).json({
                success: true,
                orders,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        };
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all orders of user
export const getAllOrderByUserId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId })
            .sort({
                createdAt: -1,
            });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all orders of seller
export const getAllOrdersByShopId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopId = req.params.shopId as string;
        const orders = await Order.find({})
            .sort({
                createdAt: 1, updatedAt: 1,
            });
        console.log(shopId);
        const ordersForShop = orders.filter(order => {
            return order.cart.some((item: any) => item[0].product.shopId === shopId);
        });

        const shopOrders = ordersForShop.map(order => ({
            cart: order.cart.filter((item: any) => item[0].product.shopId === shopId),
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update order status for seller
export const updateOrderStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }
        if (req.body.status === "Transferred to delivery partner") {
            order.cart.forEach(async (o: { _id: string; qty: number }) => {
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

        res.status(200).json({
            success: true,
            order,
        });

        async function updateOrder(id: string, qty: number) {
            const product = await Product.findById(id);

            if (!product) {
                return next(new ErrorHandler("Product not found", 404));
            }

            product.stock -= qty;
            product.sold_out += qty;

            await product.save({ validateBeforeSave: false });
        }

        async function updateSellerInfo(amount: number) {
            const seller = await Shop.findById(req.seller._id);
            if (!seller) {
                return next(new ErrorHandler("Seller/Shop not found", 404));
            }

            seller.availableBalance = amount;

            await seller.save();
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// give a refund ----- user
export const orderRefundRequest = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId as string;
        const { status } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        order.status = status;

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            order,
            message: "Order Refund Request successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// accept the refund ---- seller
export const orderRefundSuccess = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        const orderId = req.params.orderId as string;
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order Refund successful!",
        });

        if (req.body.status === "Refund Success") {
            order.cart.forEach(async (o: any) => {
                await updateOrder(o._id, o.qty);
            });
        }

        async function updateOrder(id: string, qty: any) {
            const product = await Product.findById(id);

            if (!product) {
                return next(new ErrorHandler("Product not found", 404));
            } else {
                product.stock += qty;
                product.sold_out += qty;

                await product.save({ validateBeforeSave: false });
            }

        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// all orders --- for admin
export const getAllOrdersByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find().sort({
            createdAt: -1, updatedAt: -1,
        });
        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

