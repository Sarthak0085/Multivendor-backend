import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import Messages from "../models/messages.model";
import ErrorHandler from "../utils/ErrorHandler";

// create new message
// router.post(
//     "/create-new-message",
export const createNewMessage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messageData = req.body;

        if (req.body.images) {
            const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
                folder: "messages",
            });
            messageData.images = {
                public_id: myCloud.public_id,
                url: myCloud.url,
            };
        }

        messageData.conversationId = req.body.conversationId;
        messageData.sender = req.body.sender;
        messageData.text = req.body.text;

        const message = new Messages({
            conversationId: messageData.conversationId,
            text: messageData.text,
            sender: messageData.sender,
            images: messageData.images ? messageData.images : undefined,
        });

        await message.save();

        res.status(201).json({
            success: true,
            message,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// get all messages with conversation id
// router.get(
//     "/get-all-messages/:id",
export const getAllMessagesByConversationId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationId: string = req.params.id;
        const messages = await Messages.find({
            conversationId: conversationId,
        });

        res.status(201).json({
            success: true,
            messages,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

