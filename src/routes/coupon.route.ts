import { Router } from "express";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import *  as couponController from "../controllers/coupon.controller";
import { updateAccessToken } from "../controllers/user.controller";

const couponRouter = Router();

/********************* PUBLIC ROUTES ***********/

// GET COUPON's VALUE BY NAME
couponRouter.get("/get-coupon-value/:name", couponController.getCouponByName);

/********************** PRIVATE SHOP ROUTES *********/

// CREATE COUPON BY SHOP
couponRouter.post("/create-coupon", updateSellerAccessToken, isSeller, couponController.createCoupon);

// GET ALL COUPONS OF SHOP BY SHOP_ID
couponRouter.get("/get-coupon/:shopId", updateSellerAccessToken, isSeller, couponController.getAllCouponsByShopId);

// DELETE COUPON OF SHOP BY COUPON_ID
couponRouter.delete("/delete-coupon/:couponId", updateSellerAccessToken, isSeller, couponController.deleteShopCouponById);

/********************* ADMIN ROUTES ****************/

// GET ALL COUPONS BY ADMIN
couponRouter.get("/admin-all-coupons", updateAccessToken, isAuthenticated, isAdmin, couponController.getAllCouponsByAdmin);

// DELETE COUPON BY COUPON_ID BY ADMIN
couponRouter.delete("/admin-delete-coupon/:couponId", updateAccessToken, isAuthenticated, isAdmin, couponController.deleteCouponByAdmin);

export default couponRouter;