import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Conversation from "../models/conversation.model";
import ErrorHandler from "../utils/ErrorHandler";

interface ICreateConversation {
    groupTitle: string;
    userId: string;
    sellerId: string;
}

// create a new conversation
// router.post(
//     "/create-new-conversation",
export const createNewConverstion = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupTitle, userId, sellerId } = req.body as ICreateConversation;

        const isConversationExist = await Conversation.findOne({ groupTitle });

        if (isConversationExist) {
            const conversation = isConversationExist;
            res.status(201).json({
                success: true,
                conversation,
            });
        } else {
            const conversation = await Conversation.create({
                members: [userId, sellerId],
                groupTitle: groupTitle,
            });

            res.status(201).json({
                success: true,
                conversation,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get seller conversations
// router.get(
//     "/get-all-conversation-seller/:id",
//     isSeller,
export const getAllShopConversationById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversations = await Conversation.find({
            members: {
                $in: [req.params.id],
            },
        }).sort({ updatedAt: -1, createdAt: -1 });

        res.status(201).json({
            success: true,
            conversations,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// get user conversations
// router.get(
//     "/get-all-conversation-user/:id",
//     isAuthenticated,
export const getAllUserConversationById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversations = await Conversation.find({
            members: {
                $in: [req.params.id],
            },
        }).sort({ updatedAt: -1, createdAt: -1 });

        res.status(201).json({
            success: true,
            conversations,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IUpdateLastMessage {
    lastMessage: string;
    lastMessageId: string
}

// update the last message
// router.put(
//     "/update-last-message/:id",
export const updateLastMessage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lastMessage, lastMessageId } = req.body as IUpdateLastMessage;

        const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage,
            lastMessageId,
        });

        res.status(201).json({
            success: true,
            conversation,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
