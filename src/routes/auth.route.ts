import { Router } from "express";
import { activateUser, loginUser, logoutUser, register, updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated, isSeller } from "../middleware/auth";
import { shopRegister, activateShop, loginShop, updateSellerAccessToken, logoutShop } from "../controllers/shop.controller";

const authRouter = Router();

/************** PUBLIC AUTH ROUTES **************/

// CREATE USER
authRouter.post("/create-user", register);

// ACTIVATE USER
authRouter.post("/activation-user", activateUser);

// LOGIN USER
authRouter.post("/login-user", loginUser);

/***************** PUBLIC SHOPS AUTH ROUTES ************/

// CREATE SHOP
authRouter.post("/create-shop", shopRegister);

// ACTIVATE SHOP
authRouter.post("/activation-shop", activateShop);

//LOGIN SHOP
authRouter.post("/login-shop", loginShop);

/**************** PRIVATE USER ROUTES *************/

// LOGOUT USER
authRouter.get("/logout", isAuthenticated, updateAccessToken, logoutUser);

/*************** PRIVATE SHOP ROUTES ***************/

// LOGOUT SHOP
authRouter.get("/logout-shop", isSeller, updateSellerAccessToken, logoutShop);

export default authRouter;
