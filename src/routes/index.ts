import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import shopRouter from "./shop.route";
import conversationRouter from "./conversation.route";
import couponRouter from "./coupon.route";
import eventRouter from "./event.route";
import messageRouter from "./message.route";
import paymentRouter from "./payment.route";
import withdrawRouter from "./withdraw.route";
import categoryRouter from "./category.route";
import brandRouter from "./brand.route";
import colorRouter from "./color.route";
import cartRouter from "./cart.route";
import wishlistRouter from "./wishlist.route";
import productRouter from "./product.route";
import layoutRouter from "./layout.route";
import orderRouter from "./order.route";
import analyticsRouter from "./analytics.route";
import sizeRouter from "./size.route";

const router = Router();

// FOR AUTH ROUTES
router.use("/auth", authRouter);

// FOR USER ROUTES
router.use("/user", userRouter);

// FOR SHOP ROUTES
router.use("/shop", shopRouter);

// FOR CONVERSATION ROUTES
router.use("/conversation", conversationRouter);

// FOR COUPON ROUTES
router.use("/coupon", couponRouter);

// FOR PRODUCT ROUTES
router.use("/product", productRouter);

// FOR EVENT ROUTES
router.use("/event", eventRouter);

// FOR MESSAGE ROUTES
router.use("/message", messageRouter);

// FOR ORDER ROUTES
router.use("/order", orderRouter);

// FOR PAYMENT ROUTES
router.use("/payment", paymentRouter);

//FOR WITHDRAW ROUTES
router.use("/withdraw", withdrawRouter);

// FOR CATEGORY ROUTES
router.use("/category", categoryRouter);

// FOR BRAND ROUTES
router.use("/brand", brandRouter);

// FOR COLOR ROUTES
router.use("/color", colorRouter);

// FOR SIZE ROUTES
router.use("/size", sizeRouter);

// FOR CART ROUTER
router.use("/cart", cartRouter);

// FOR WISHLIST ROUTER
router.use("/wishlist", wishlistRouter);

// FOR LAYOUT ROUTES
router.use("/layout", layoutRouter);

// FOR ANALYTICS ROUTES
router.use("/analytic", analyticsRouter);

export default router;
