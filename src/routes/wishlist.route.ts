import { Router } from "express";
import { updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
import { emptyWishlist, getWishlistData, toggleWishlist } from "../controllers/wishlist.controller";

const wishlistRouter = Router();

/************** PRIVATE USER ROUTER ***************/

// ADD TO wishlist BY USER
wishlistRouter.post("/add-wishlist", updateAccessToken, isAuthenticated, toggleWishlist);

// REMOVE FROM wishlist BY USER
wishlistRouter.post("/remove-wishlist", updateAccessToken, isAuthenticated, toggleWishlist);

// EMPTY wishlist BY USER
wishlistRouter.delete("/empty-wishlist", updateAccessToken, isAuthenticated, emptyWishlist);

// GET wishlist DATA
wishlistRouter.get("/get-wishlist/:userId", updateAccessToken, isAuthenticated, getWishlistData);

export default wishlistRouter;