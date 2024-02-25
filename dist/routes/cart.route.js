"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const cart_controller_1 = require("../controllers/cart.controller");
const cartRouter = (0, express_1.Router)();
/************** PRIVATE USER ROUTER ***************/
// ADD TO CART BY USER
cartRouter.post("/add-cart", user_controller_1.updateAccessToken, auth_1.isAuthenticated, cart_controller_1.addedToCart);
// // REMOVE FROM CART BY USER
cartRouter.post("/remove-Cart", user_controller_1.updateAccessToken, auth_1.isAuthenticated, cart_controller_1.removeFromCart);
// EMPTY CART BY USER
cartRouter.delete("/empty-cart/:userId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, cart_controller_1.emptyCart);
// GET CART DATA
cartRouter.get("/get-cart/:userId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, cart_controller_1.getCartData);
exports.default = cartRouter;
