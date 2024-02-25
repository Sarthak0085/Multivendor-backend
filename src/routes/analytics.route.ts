import { Router } from "express";
import { updateAccessToken } from "../controllers/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import * as analyticsController from "../controllers/analytics.controller";

const analyticsRouter = Router();

/***************** ADMIN ROUTES ***********/

// USER ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-users", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getUserAnalytics);

// SHOP ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-shops", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getShopAnalytics);

// ORDER ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-orders", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getOrderAnalytics);

// EVENT ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-events", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getEventAnalytics);

// PRODUCTS ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-products", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getProductAnalytics);

// COUPON ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-coupons", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getCouponAnalytics);

// WITHDRAW ANALYTICS BY ADMIN
analyticsRouter.get("/admin-get-withdraws", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getWithdrawAnalytics);


export default analyticsRouter;