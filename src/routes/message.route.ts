import { Router } from "express";
import { createNewMessage, getAllMessagesByConversationId } from "../controllers/message.controller";

const messageRouter = Router();

messageRouter.post("/create-new-message", createNewMessage);

messageRouter.get("/get-all-messages/:id", getAllMessagesByConversationId);

export default messageRouter;