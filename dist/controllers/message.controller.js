"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessagesByConversationId = exports.createNewMessage = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const cloudinary_1 = __importDefault(require("cloudinary"));
const messages_model_1 = __importDefault(require("../models/messages.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// create new message
// router.post(
//     "/create-new-message",
exports.createNewMessage = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const messageData = req.body;
        if (req.body.images) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(req.body.images, {
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
        const message = new messages_model_1.default({
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all messages with conversation id
// router.get(
//     "/get-all-messages/:id",
exports.getAllMessagesByConversationId = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const conversationId = req.params.id;
        const messages = await messages_model_1.default.find({
            conversationId: conversationId,
        });
        res.status(201).json({
            success: true,
            messages,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
