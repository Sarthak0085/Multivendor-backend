import { Router } from "express";
import { updateAccessToken } from "../controllers/user.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { createOrder, getAllOrderByUserId, getAllOrdersByAdmin, getAllOrdersByShopId, orderRefundRequest, orderRefundSuccess, updateOrderStatus } from "../controllers/order.controller";
import { updateSellerAccessToken } from "../controllers/shop.controller";

const orderRouter = Router();

/***************** PRIVATE USER ROUTES **********/

//  CREATE ORDER BY USER
orderRouter.post("/create", updateAccessToken, isAuthenticated, createOrder);

// REFUND REQUEST BY USER
orderRouter.put("/refund-request/:orderId", updateAccessToken, isAuthenticated, orderRefundRequest);

// GET ALL USER ORDERS BY USER ID
orderRouter.get("/get-all/:userId", updateAccessToken, isAuthenticated, getAllOrderByUserId);

/******************** PRIVATE SELLER ROUTES ***********/

// GET ALL SHOP ORDERS BY SHOP ID
orderRouter.get("/get-all-shop/:shopId", updateSellerAccessToken, isSeller, getAllOrdersByShopId);

// REFUND SUCCESS BY SELLER
orderRouter.put("/refund-success/:orderId", updateSellerAccessToken, isSeller, orderRefundSuccess);

// UPDATE ORDER STATUS BY SELLER
orderRouter.put("/update-status/:orderId", updateSellerAccessToken, isSeller, updateOrderStatus);

/******************* ADMIN ROUTES *********/

// GET ALL ORDERS BY ADMIN
orderRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getAllOrdersByAdmin);

// UPDATE ORDER STATUS BY ADMIN
orderRouter.put("/admin-update-status/:orderId", updateAccessToken, isAuthenticated, isAdmin, updateOrderStatus);

export default orderRouter;
