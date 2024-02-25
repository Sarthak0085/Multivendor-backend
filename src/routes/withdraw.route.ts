import { Router } from "express";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { createWithdrawRequest, getAllWithdrawRequestByAdmin, updateWithdrawRequestByAdmin } from "../controllers/withdraw.controller";
import { updateAccessToken } from "../controllers/user.controller";

const withdrawRouter = Router();

/****************** PRIVATE SELLER ROUTES ***************/

// CREATE WITHDRAW REQUEST BY SELLER
withdrawRouter.post("/create-withdraw-request", updateSellerAccessToken, isSeller, createWithdrawRequest);

/****************** ADMIN ROUTES *****************/

// GET ALL WITHDRAW REQUEST BY ADMIN
withdrawRouter.get("/admin-get-all-withdraw-request", updateAccessToken, isAuthenticated, isAdmin, getAllWithdrawRequestByAdmin);

// UPDATE WITHDRAW REQUEST BY ID
withdrawRouter.put("/update-withdraw-request/:id", updateAccessToken, isAuthenticated, isAdmin, updateWithdrawRequestByAdmin);

export default withdrawRouter;