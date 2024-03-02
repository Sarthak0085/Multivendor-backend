"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteEventById = exports.getAllEventsByAdmin = exports.deleteShopEventById = exports.getEventById = exports.getAllEventsOfShopById = exports.getAllEvents = exports.createEvent = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const event_model_1 = __importDefault(require("../models/event.model"));
// create event
// router.post(
//     "/create-event",
exports.createEvent = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await shop_model_1.default.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop Id is invalid!", 400));
        }
        else {
            let images = [];
            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            }
            else {
                images = req.body.images;
            }
            const imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary_1.default.v2.uploader.upload(images[i], {
                    folder: "products",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            const productData = req.body;
            productData.images = imagesLinks;
            productData.shop = shop;
            const event = await event_model_1.default.create(productData);
            res.status(201).json({
                success: true,
                event,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all events
// router.get("/get-all-events",
exports.getAllEvents = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const events = await event_model_1.default.find().sort({
            createdAt: 1, updatedAt: 1
        });
        res.status(201).json({
            success: true,
            events,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all events of a shop
// router.get(
//     "/get-all-events/:id",
exports.getAllEventsOfShopById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopId = req.params.shopId;
        const events = await event_model_1.default.find({ shopId: shopId }).sort({ createdAt: 1, updatedAt: 1 });
        res.status(201).json({
            success: true,
            events,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getEventById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await event_model_1.default.findById(eventId);
        if (!event) {
            return next(new ErrorHandler_1.default("Event not found", 404));
        }
        res.status(201).json({
            success: true,
            event,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteShopEventById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await event_model_1.default.findById(eventId);
        if (!event) {
            return next(new ErrorHandler_1.default("Event not found", 404));
        }
        for (let i = 0; 1 < event.images.length; i++) {
            const result = await cloudinary_1.default.v2.uploader.destroy(event.images[i].public_id);
        }
        await event_model_1.default.findByIdAndDelete(eventId);
        res.status(201).json({
            success: true,
            message: "Event Deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllEventsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const events = await event_model_1.default.find().sort({
            createdAt: 1, updatedAt: 1
        });
        res.status(201).json({
            success: true,
            events,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.adminDeleteEventById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await event_model_1.default.findByIdAndDelete(eventId);
        if (!event) {
            return next(new ErrorHandler_1.default("Event not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Event deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
