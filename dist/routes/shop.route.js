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
const shopController = __importStar(require("../controllers/shop.controller"));
const user_controller_1 = require("../controllers/user.controller");
const shopRouter = (0, express_1.Router)();
/******************** PRIVATE SHOP ROUTES *****************/
// GET SHOP DETAILS
shopRouter.get("/get-shop", shopController.updateSellerAccessToken, auth_1.isSeller, shopController.getShop);
// GET SHOP DETAILS BY ID
shopRouter.get("/get-shop-info/:id", shopController.getShopInfoById);
// UPDATE SHOP INFO
shopRouter.put("/update-shop-info", shopController.updateSellerAccessToken, auth_1.isSeller, shopController.updateShopInfo);
// UPDATE SHOP AVATAR
shopRouter.put("/update-shop-avatar", shopController.updateSellerAccessToken, auth_1.isSeller, shopController.updateShopAvatar);
// UPDATE PAYMENT METHODS FOR SHOP
shopRouter.put("/update-payment-methods", shopController.updateSellerAccessToken, auth_1.isSeller, shopController.updateShopPayentmethods);
// DELETE WITHDRAW METHOD FOR SHOP
shopRouter.delete("/delete-withdraw-method", shopController.updateSellerAccessToken, auth_1.isSeller, shopController.deleteShopWithdrawMethods);
/******************* ADMIN ROUTES ***************/
// GET ALL SHOPS BY ADMIN
shopRouter.get("/admin-all-sellers", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, shopController.getAllShopsByAdmin);
// Block/ UNBlock SHOP BY ADMIN
shopRouter.put("/admin-update/:shopId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, shopController.updateShopByAdmin);
// DELETE SHOP BY ADMIN
shopRouter.delete("/admin-delete-shop/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, shopController.deleteShopByAdmin);
exports.default = shopRouter;
