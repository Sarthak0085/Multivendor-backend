"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const paymentRouter = (0, express_1.Router)();
/**************** PUBLIC ROUTES **********/
// GET STRIPE PUBLISHABLE KEY
paymentRouter.get("/stripePublishablekey", payment_controller_1.getStripeApiKey);
/******************** PRIVATE USER ROUTES *********/
// PROCESS PAYMENT
paymentRouter.post("/process", user_controller_1.updateAccessToken, auth_1.isAuthenticated, payment_controller_1.processPayment);
exports.default = paymentRouter;
