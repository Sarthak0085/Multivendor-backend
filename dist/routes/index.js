"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const shop_route_1 = __importDefault(require("./shop.route"));
const conversation_route_1 = __importDefault(require("./conversation.route"));
const coupon_route_1 = __importDefault(require("./coupon.route"));
const event_route_1 = __importDefault(require("./event.route"));
const message_route_1 = __importDefault(require("./message.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
const withdraw_route_1 = __importDefault(require("./withdraw.route"));
const category_route_1 = __importDefault(require("./category.route"));
const brand_route_1 = __importDefault(require("./brand.route"));
const color_route_1 = __importDefault(require("./color.route"));
const cart_route_1 = __importDefault(require("./cart.route"));
const wishlist_route_1 = __importDefault(require("./wishlist.route"));
const product_route_1 = __importDefault(require("./product.route"));
const layout_route_1 = __importDefault(require("./layout.route"));
const order_route_1 = __importDefault(require("./order.route"));
const analytics_route_1 = __importDefault(require("./analytics.route"));
const router = (0, express_1.Router)();
// FOR AUTH ROUTES
router.use("/auth", auth_route_1.default);
// FOR USER ROUTES
router.use("/user", user_route_1.default);
// FOR SHOP ROUTES
router.use("/shop", shop_route_1.default);
// FOR CONVERSATION ROUTES
router.use("/conversation", conversation_route_1.default);
// FOR COUPON ROUTES
router.use("/coupon", coupon_route_1.default);
// FOR PRODUCT ROUTES
router.use("/product", product_route_1.default);
// FOR EVENT ROUTES
router.use("/event", event_route_1.default);
// FOR MESSAGE ROUTES
router.use("/message", message_route_1.default);
// FOR ORDER ROUTES
router.use("/order", order_route_1.default);
// FOR PAYMENT ROUTES
router.use("/payment", payment_route_1.default);
//FOR WITHDRAW ROUTES
router.use("/withdraw", withdraw_route_1.default);
// FOR CATEGORY ROUTES
router.use("/category", category_route_1.default);
// FOR BRAND ROUTES
router.use("/brand", brand_route_1.default);
// FOR COLOR ROUTES
router.use("/color", color_route_1.default);
// FOR CART ROUTER
router.use("/cart", cart_route_1.default);
// FOR WISHLIST ROUTER
router.use("/wishlist", wishlist_route_1.default);
// FOR LAYOUT ROUTES
router.use("/layout", layout_route_1.default);
// FOR ANALYTICS ROUTES
router.use("/analytic", analytics_route_1.default);
exports.default = router;
