import { Router } from "express";
import { getStripeApiKey, processPayment } from "../controllers/payment.controller";
import { updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const paymentRouter = Router();

/**************** PUBLIC ROUTES **********/

// GET STRIPE PUBLISHABLE KEY
paymentRouter.get("/stripePublishablekey", getStripeApiKey);

/******************** PRIVATE USER ROUTES *********/

// PROCESS PAYMENT
paymentRouter.post("/process", updateAccessToken, isAuthenticated, processPayment);


export default paymentRouter;