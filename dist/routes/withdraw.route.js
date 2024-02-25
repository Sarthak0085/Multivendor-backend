"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controllers/shop.controller");
const auth_1 = require("../middleware/auth");
const withdraw_controller_1 = require("../controllers/withdraw.controller");
const user_controller_1 = require("../controllers/user.controller");
const withdrawRouter = (0, express_1.Router)();
/****************** PRIVATE SELLER ROUTES ***************/
// CREATE WITHDRAW REQUEST BY SELLER
withdrawRouter.post("/create-withdraw-request", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, withdraw_controller_1.createWithdrawRequest);
/****************** ADMIN ROUTES *****************/
// GET ALL WITHDRAW REQUEST BY ADMIN
withdrawRouter.get("/admin-get-all-withdraw-request", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, withdraw_controller_1.getAllWithdrawRequestByAdmin);
// UPDATE WITHDRAW REQUEST BY ID
withdrawRouter.put("/update-withdraw-request/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, withdraw_controller_1.updateWithdrawRequestByAdmin);
exports.default = withdrawRouter;
