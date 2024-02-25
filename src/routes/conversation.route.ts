import { Router } from "express";
import { createNewConverstion, getAllShopConversationById, getAllUserConversationById, updateLastMessage } from "../controllers/conversation.controller";
import { isAuthenticated, isSeller } from "../middleware/auth";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { updateAccessToken } from "../controllers/user.controller";

const conversationRouter = Router();

conversationRouter.post("/create-new-conversation", createNewConverstion);

conversationRouter.get("/get-all-conversation-seller/:id", updateSellerAccessToken, isSeller, getAllShopConversationById);

conversationRouter.get("/get-all-conversation-user/:id", updateAccessToken, isAuthenticated, getAllUserConversationById);

conversationRouter.put("/update-last-message/:id", updateLastMessage);

export default conversationRouter;