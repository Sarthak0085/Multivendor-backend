import { Router } from "express";
import { updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
import { addedToCart, emptyCart, getCartData, removeFromCart } from "../controllers/cart.controller";

const cartRouter = Router();

/************** PRIVATE USER ROUTER ***************/

// ADD TO CART BY USER
cartRouter.post("/add-cart", updateAccessToken, isAuthenticated, addedToCart);

// // REMOVE FROM CART BY USER
cartRouter.post("/remove-Cart", updateAccessToken, isAuthenticated, removeFromCart);

// EMPTY CART BY USER
cartRouter.delete("/empty-cart/:userId", updateAccessToken, isAuthenticated, emptyCart);

// GET CART DATA
cartRouter.get("/get-cart/:userId", updateAccessToken, isAuthenticated, getCartData);

export default cartRouter;