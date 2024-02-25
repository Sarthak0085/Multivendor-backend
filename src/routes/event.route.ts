import { Router } from "express";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { createEvent, deleteShopEventById, getAllEvents, getAllEventsByAdmin, getAllEventsOfShopById } from "../controllers/event.controller";
import { updateAccessToken } from "../controllers/user.controller";

const eventRouter = Router();

/************ PUBLIC ROUTES ************/

// GET ALL EVENTS
eventRouter.get("/get-all-events", getAllEvents);

// GET ALL EVENTS OF SHOP BY shopId
eventRouter.get("/get-all-events/:shopId", getAllEventsOfShopById);


/******************* PRIVATE SHOP ROUTES *********/

// CREATE EVENT BY SELLER
eventRouter.post("/create", updateSellerAccessToken, isSeller, createEvent);


// DELETE EVENT OF SHOP BY eventId
eventRouter.delete("/delete-shop-event/:eventId", updateSellerAccessToken, isSeller, deleteShopEventById);


/******************* ADMIN ROUTES **************/

// GET ALL EVENTS BY ADMIN
eventRouter.get("/admin-all-events", updateAccessToken, isAuthenticated, isAdmin, getAllEventsByAdmin);


export default eventRouter