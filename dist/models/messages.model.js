"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messagesSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: String,
    },
    text: {
        type: String,
    },
    sender: {
        type: String,
    },
    images: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
}, { timestamps: true });
const Messages = mongoose_1.default.model("Messages", messagesSchema);
exports.default = Messages;
