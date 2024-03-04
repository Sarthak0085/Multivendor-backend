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
        // const messageData: any = {}; // Create an empty object to store message data

        // if (req.files) {
        //     for (const file of req.files) {
        //         switch (file.fieldname) {
        //             case "images":
        //                 const imageCloud = await cloudinary.v2.uploader.upload(file.path, {
        //                     folder: "messages",
        //                 })
        //                 messageData.image = {
        //                     public_id: imageCloud.public_id,
        //                     url: imageCloud.url,
        //                 }
        //             case "audio":
        //                 const audioCloud = await cloudinary.v2.uploader.upload(file.path, {
        //                     folder: "messages",
        //                 });
        //                 messageData.audio = {
        //                     public_id: audioCloud.public_id,
        //                     url: audioCloud.url,
        //                 };
        //                 break;
        //             case "video":
        //                 const videoCloud = await cloudinary.v2.uploader.upload(file.path, {
        //                     folder: "messages",
        //                 });
        //                 messageData.video = {
        //                     public_id: videoCloud.public_id,
        //                     url: videoCloud.url,
        //                 };
        //                 break;
        //             // Handle other file types similarly (e.g., emojis, GIFs, PDFs, etc.)
        //             // Add more cases as needed for each file type
        //             default:
        //                 // Handle other file types (emojis, GIFs, PDFs, etc.)
        //                 break;
        //         }
        //     }
        // }

        // // Populate other message data from the request body
        // messageData.conversationId = req.body.conversationId;
        // messageData.sender = req.body.sender;
        // messageData.text = req.body.text;

        // // Create a new message instance using the messageData object
        // const message = new Messages({
        //     conversationId: messageData.conversationId,
        //     text: messageData.text,
        //     sender: messageData.sender,
        //     audio: messageData.audio ? messageData.audio : undefined,
        //     video: messageData.video ? messageData.video : undefined,
        // });

        // await message.save();

        // res.status(201).json({
        //     success: true,
        //     message,
        // });

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

