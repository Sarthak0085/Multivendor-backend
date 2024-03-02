"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const shop_controller_1 = require("../controllers/shop.controller");
const authRouter = (0, express_1.Router)();
/************** PUBLIC AUTH ROUTES **************/
// CREATE USER
authRouter.post("/create-user", user_controller_1.register);
// ACTIVATE USER
authRouter.post("/activation-user", user_controller_1.activateUser);
// LOGIN USER
authRouter.post("/login-user", user_controller_1.loginUser);
// FORGOT PASSWORD
authRouter.post("/forgot-password", user_controller_1.forgotPassword);
// RESET PASSWORD
authRouter.post("/reset-password", user_controller_1.resetPassword);
/***************** PUBLIC SHOPS AUTH ROUTES ************/
// CREATE SHOP
authRouter.post("/create-shop", shop_controller_1.shopRegister);
// ACTIVATE SHOP
authRouter.post("/activation-shop", shop_controller_1.activateShop);
// LOGIN SHOP
authRouter.post("/login-shop", shop_controller_1.loginShop);
// FORGOT SHOP PASSWORD
authRouter.post("/forgot-shop-password", shop_controller_1.forgotShopPassword);
// RESET SHOP PASSWORD
authRouter.post("/reset-shop-password", shop_controller_1.resetShopPassword);
/**************** PRIVATE USER ROUTES *************/
// LOGOUT USER
authRouter.get("/logout", auth_1.isAuthenticated, user_controller_1.updateAccessToken, user_controller_1.logoutUser);
/*************** PRIVATE SHOP ROUTES ***************/
// LOGOUT SHOP
authRouter.get("/logout-shop", auth_1.isSeller, shop_controller_1.updateSellerAccessToken, shop_controller_1.logoutShop);
exports.default = authRouter;
