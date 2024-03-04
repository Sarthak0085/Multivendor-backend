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
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const analyticsController = __importStar(require("../controllers/analytics.controller"));
const analyticsRouter = (0, express_1.Router)();
/***************** ADMIN ROUTES ***********/
// USER ANALYTICS BY ADMIN BASED ON TIMEFRAME
// analyticsRouter.get("/admin-get-users", updateAccessToken, isAuthenticated, isAdmin, )
// USER ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-users", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getUsersAnalytics);
// SHOP ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-shops", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getShopAnalytics);
// ORDER ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-orders", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getOrdersAnalytics);
// PRODUCT ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-products", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getProductsAnalytics);
// EVENT ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-events", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getEventsAnalytics);
// COUPON ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-coupons", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getCouponsAnalytics);
// WITHDRAW ANALYTICS BY ADMIN BASED ON TIMEFRAME
analyticsRouter.get("/admin-get-withdraws", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, analyticsController.getWithdrawsAnalytics);
// analyticsRouter.get("/admin-get-users", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getUsersLast12MonthsAnalytics);
// // LAST 30 DAYS USER ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-users-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getUserLast30DaysAnalytics);
// // LAST 24 HOURS USER ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-users-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getUserLast24HoursAnalytics);
// //LAST 12 MONTHS SHOP ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-shops-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getShopLast12MonthsAnalytics);
// // LAST 30 DAYS SHOP ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-shops-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getShopLast30DaysAnalytics);
// // LAST 24 HOURS SHOP ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-shops-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getShopLast24HoursAnalytics);
// //LAST 12 MONTHS ORDER ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-orders-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast12MonthsOrdersAnalytics);
// //LAST 30 DAYS ORDER ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-orders-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast30DaysOrdersAnalytics);
// //LAST 24 HOURS ORDER ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-orders-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast24HoursOrdersAnalytics);
// // LAST 12 MONTHS EVENT ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-events-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast12MonthsEventsAnalytics);
// // LAST 30 DAYS EVENT ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-events-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast30DaysEventsAnalytics);
// // LAST 24 HOURS EVENT ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-events-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast24HoursEventsAnalytics);
// // LAST 12 MONTHS PRODUCTS ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-products-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast12MonthsProductAnalytics);
// // LAST 30 DAYS PRODUCTS ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-products-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast30DaysProductsAnalytics);
// // LAST 24 HOURS PRODUCTS ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-products-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast24HoursProductsAnalytics);
// // LAST 12 MONTHS COUPON ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-coupons-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast12MonthsCouponAnalytics);
// // LAST 30 days COUPON ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-coupons-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast30DaysCouponsAnalytics);
// // LAST 24 hours COUPON ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-coupons-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast24HoursCouponsAnalytics);
// // LAST 12 MONTHS WITHDRAW ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-withdraws-last-12-months", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast12MonthsWithdrawAnalytics);
// // LAST 30 days WITHDRAW ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-withdraws-last-30-days", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast30DaysWithdrawsAnalytics);
// // LAST 24 hours WITHDRAW ANALYTICS BY ADMIN
// analyticsRouter.get("/admin-get-withdraws-last-24-hours", updateAccessToken, isAuthenticated, isAdmin, analyticsController.getLast24HoursWithdrawsAnalytics);
exports.default = analyticsRouter;
