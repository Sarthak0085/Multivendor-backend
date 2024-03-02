import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Shop from "../models/shop.model";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import Event from "../models/event.model";

// create event
// router.post(
//     "/create-event",
export const createEvent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Shop Id is invalid!", 400));
        } else {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
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

            const event = await Event.create(productData);

            res.status(201).json({
                success: true,
                event,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all events
// router.get("/get-all-events",
export const getAllEvents = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find().sort({
            createdAt: 1, updatedAt: 1
        });
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all events of a shop
// router.get(
//     "/get-all-events/:id",
export const getAllEventsOfShopById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopId = req.params.shopId
        const events = await Event.find({ shopId: shopId }).sort({ createdAt: 1, updatedAt: 1 });

        res.status(201).json({
            success: true,
            events,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getEventById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }
        res.status(201).json({
            success: true,
            event,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const deleteShopEventById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId as string;
        const event = await Event.findById(eventId);

        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        for (let i = 0; 1 < event.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(
                event.images[i].public_id
            );
        }

        await Event.findByIdAndDelete(eventId)

        res.status(201).json({
            success: true,
            message: "Event Deleted successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getAllEventsByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find().sort({
            createdAt: 1, updatedAt: 1
        });
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const adminDeleteEventById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});