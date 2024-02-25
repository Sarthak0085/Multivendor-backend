import { Router } from "express";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import * as shopController from "../controllers/shop.controller";
import { updateAccessToken } from "../controllers/user.controller";

const shopRouter = Router();

/******************** PRIVATE SHOP ROUTES *****************/

// GET SHOP DETAILS
shopRouter.get("/get-shop", shopController.updateSellerAccessToken, isSeller, shopController.getShop);

// GET SHOP DETAILS BY ID
shopRouter.get("/get-shop-info/:id", shopController.getShopInfoById);

// UPDATE SHOP INFO
shopRouter.put("/update-shop-info", shopController.updateSellerAccessToken, isSeller, shopController.updateShopInfo);

// UPDATE SHOP AVATAR
shopRouter.put("/update-shop-avatar", shopController.updateSellerAccessToken, isSeller, shopController.updateShopAvatar);

// UPDATE PAYMENT METHODS FOR SHOP
shopRouter.put("/update-payment-methods", shopController.updateSellerAccessToken, isSeller, shopController.updateShopPayentmethods);

// DELETE WITHDRAW METHOD FOR SHOP
shopRouter.delete("/delete-withdraw-method", shopController.updateSellerAccessToken, isSeller, shopController.deleteShopWithdrawMethods);

/******************* ADMIN ROUTES ***************/

// GET ALL SHOPS BY ADMIN
shopRouter.get("/admin-all-sellers", updateAccessToken, isAuthenticated, isAdmin, shopController.getAllShopsByAdmin);

// DELETE SHOP BY ADMIN
shopRouter.delete("/admin-delete-shop/:id", updateAccessToken, isAuthenticated, isAdmin, shopController.deleteShopByAdmin);

export default shopRouter;