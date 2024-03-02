import { Router } from "express";
import { activateUser, forgotPassword, loginUser, logoutUser, register, resetPassword, updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated, isSeller } from "../middleware/auth";
import { shopRegister, activateShop, loginShop, updateSellerAccessToken, logoutShop, forgotShopPassword, resetShopPassword } from "../controllers/shop.controller";

const authRouter = Router();

/************** PUBLIC AUTH ROUTES **************/

// CREATE USER
authRouter.post("/create-user", register);

// ACTIVATE USER
authRouter.post("/activation-user", activateUser);

// LOGIN USER
authRouter.post("/login-user", loginUser);

// FORGOT PASSWORD
authRouter.post("/forgot-password", forgotPassword);

// RESET PASSWORD
authRouter.post("/reset-password", resetPassword);

/***************** PUBLIC SHOPS AUTH ROUTES ************/

// CREATE SHOP
authRouter.post("/create-shop", shopRegister);

// ACTIVATE SHOP
authRouter.post("/activation-shop", activateShop);

// LOGIN SHOP
authRouter.post("/login-shop", loginShop);

// FORGOT SHOP PASSWORD
authRouter.post("/forgot-shop-password", forgotShopPassword);

// RESET SHOP PASSWORD
authRouter.post("/reset-shop-password", resetShopPassword);

/**************** PRIVATE USER ROUTES *************/

// LOGOUT USER
authRouter.get("/logout", isAuthenticated, updateAccessToken, logoutUser);

/*************** PRIVATE SHOP ROUTES ***************/

// LOGOUT SHOP
authRouter.get("/logout-shop", isSeller, updateSellerAccessToken, logoutShop);

export default authRouter;
