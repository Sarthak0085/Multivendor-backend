"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const shop_controller_1 = require("../controllers/shop.controller");
const couponController = __importStar(require("../controllers/coupon.controller"));
const user_controller_1 = require("../controllers/user.controller");
const couponRouter = (0, express_1.Router)();
/********************* PUBLIC ROUTES ***********/
// GET COUPON's VALUE BY NAME
couponRouter.get("/get-coupon-value/:name", couponController.getCouponByName);
/********************** PRIVATE SHOP ROUTES *********/
// CREATE COUPON BY SHOP
couponRouter.post("/create-coupon", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, couponController.createCoupon);
// GET ALL COUPONS OF SHOP BY SHOP_ID
couponRouter.get("/get-coupon/:shopId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, couponController.getAllCouponsByShopId);
// DELETE COUPON OF SHOP BY COUPON_ID
couponRouter.delete("/delete-coupon/:couponId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, couponController.deleteShopCouponById);
/********************* ADMIN ROUTES ****************/
// GET ALL COUPONS BY ADMIN
couponRouter.get("/admin-all-coupons", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, couponController.getAllCouponsByAdmin);
// DELETE COUPON BY COUPON_ID BY ADMIN
couponRouter.delete("/admin-delete-coupon/:couponId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, couponController.deleteCouponByAdmin);
exports.default = couponRouter;
