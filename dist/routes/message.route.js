"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const messageRouter = (0, express_1.Router)();
messageRouter.post("/create-new-message", message_controller_1.createNewMessage);
messageRouter.get("/get-all-messages/:id", message_controller_1.getAllMessagesByConversationId);
exports.default = messageRouter;
