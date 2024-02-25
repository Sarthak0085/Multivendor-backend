"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const wishlistRouter = (0, express_1.Router)();
/************** PRIVATE USER ROUTER ***************/
// ADD TO wishlist BY USER
wishlistRouter.post("/add-wishlist", user_controller_1.updateAccessToken, auth_1.isAuthenticated, wishlist_controller_1.toggleWishlist);
// REMOVE FROM wishlist BY USER
wishlistRouter.post("/remove-wishlist", user_controller_1.updateAccessToken, auth_1.isAuthenticated, wishlist_controller_1.toggleWishlist);
// EMPTY wishlist BY USER
wishlistRouter.delete("/empty-wishlist", user_controller_1.updateAccessToken, auth_1.isAuthenticated, wishlist_controller_1.emptyWishlist);
// GET wishlist DATA
wishlistRouter.get("/get-wishlist/:userId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, wishlist_controller_1.getWishlistData);
exports.default = wishlistRouter;
