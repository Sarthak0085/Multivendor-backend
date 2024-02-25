"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controllers/shop.controller");
const auth_1 = require("../middleware/auth");
const event_controller_1 = require("../controllers/event.controller");
const user_controller_1 = require("../controllers/user.controller");
const eventRouter = (0, express_1.Router)();
/************ PUBLIC ROUTES ************/
// GET ALL EVENTS
eventRouter.get("/get-all-events", event_controller_1.getAllEvents);
// GET ALL EVENTS OF SHOP BY shopId
eventRouter.get("/get-all-events/:shopId", event_controller_1.getAllEventsOfShopById);
/******************* PRIVATE SHOP ROUTES *********/
// CREATE EVENT BY SELLER
eventRouter.post("/create", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, event_controller_1.createEvent);
// DELETE EVENT OF SHOP BY eventId
eventRouter.delete("/delete-shop-event/:eventId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, event_controller_1.deleteShopEventById);
/******************* ADMIN ROUTES **************/
// GET ALL EVENTS BY ADMIN
eventRouter.get("/admin-all-events", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, event_controller_1.getAllEventsByAdmin);
exports.default = eventRouter;
