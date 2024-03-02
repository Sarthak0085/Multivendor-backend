"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order.controller");
const shop_controller_1 = require("../controllers/shop.controller");
const orderRouter = (0, express_1.Router)();
/***************** PRIVATE USER ROUTES **********/
//  CREATE ORDER BY USER
orderRouter.post("/create", user_controller_1.updateAccessToken, auth_1.isAuthenticated, order_controller_1.createOrder);
// REFUND REQUEST BY USER
orderRouter.put("/refund-request/:orderId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, order_controller_1.orderRefundRequest);
// GET ALL USER ORDERS BY USER ID
orderRouter.get("/get-all/:userId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, order_controller_1.getAllOrderByUserId);
/******************** PRIVATE SELLER ROUTES ***********/
// GET ALL SHOP ORDERS BY SHOP ID
orderRouter.get("/get-all-shop/:shopId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, order_controller_1.getAllOrdersByShopId);
// REFUND SUCCESS BY SELLER
orderRouter.put("/refund-success/:orderId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, order_controller_1.orderRefundSuccess);
// UPDATE ORDER STATUS BY SELLER
orderRouter.put("/update-status/:orderId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, order_controller_1.updateOrderStatus);
/******************* ADMIN ROUTES *********/
// GET ALL ORDERS BY ADMIN
orderRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, order_controller_1.getAllOrdersByAdmin);
// UPDATE ORDER STATUS BY ADMIN
orderRouter.put("/admin-update-status/:orderId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, order_controller_1.updateOrderStatus);
exports.default = orderRouter;
