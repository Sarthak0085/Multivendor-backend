"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastMessage = exports.getAllUserConversationById = exports.getAllShopConversationById = exports.createNewConverstion = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// create a new conversation
// router.post(
//     "/create-new-conversation",
exports.createNewConverstion = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { groupTitle, userId, sellerId } = req.body;
        const isConversationExist = await conversation_model_1.default.findOne({ groupTitle });
        if (isConversationExist) {
            const conversation = isConversationExist;
            res.status(201).json({
                success: true,
                conversation,
            });
        }
        else {
            const conversation = await conversation_model_1.default.create({
                members: [userId, sellerId],
                groupTitle: groupTitle,
            });
            res.status(201).json({
                success: true,
                conversation,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get seller conversations
// router.get(
//     "/get-all-conversation-seller/:id",
//     isSeller,
exports.getAllShopConversationById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const conversations = await conversation_model_1.default.find({
            members: {
                $in: [req.params.id],
            },
        }).sort({ updatedAt: -1, createdAt: -1 });
        res.status(201).json({
            success: true,
            conversations,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get user conversations
// router.get(
//     "/get-all-conversation-user/:id",
//     isAuthenticated,
exports.getAllUserConversationById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const conversations = await conversation_model_1.default.find({
            members: {
                $in: [req.params.id],
            },
        }).sort({ updatedAt: -1, createdAt: -1 });
        res.status(201).json({
            success: true,
            conversations,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update the last message
// router.put(
//     "/update-last-message/:id",
exports.updateLastMessage = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { lastMessage, lastMessageId } = req.body;
        const conversation = await conversation_model_1.default.findByIdAndUpdate(req.params.id, {
            lastMessage,
            lastMessageId,
        });
        res.status(201).json({
            success: true,
            conversation,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
