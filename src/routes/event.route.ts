import { Router } from "express";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { adminDeleteEventById, createEvent, deleteShopEventById, getAllEvents, getAllEventsByAdmin, getAllEventsOfShopById, getEventById } from "../controllers/event.controller";
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

// GET PRODUCT BY PRODUCT ID BY SELLER
eventRouter.get("/get-event/:eventId", updateSellerAccessToken, isSeller, getEventById)

// DELETE EVENT OF SHOP BY eventId
eventRouter.delete("/delete-shop-event/:eventId", updateSellerAccessToken, isSeller, deleteShopEventById);


/******************* ADMIN ROUTES **************/

// GET ALL EVENTS BY ADMIN
eventRouter.get("/admin-all-events", updateAccessToken, isAuthenticated, isAdmin, getAllEventsByAdmin);

// ADMIN DELETE EVENT BY EVENT ID
eventRouter.delete("/admin-delete/:eventId", updateAccessToken, isAuthenticated, isAdmin, adminDeleteEventById);


export default eventRouter