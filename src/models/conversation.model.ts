import mongoose from "mongoose";
import { Document } from "mongoose";

interface IConversation extends Document {
    groupTitle?: string;
    members?: string[];
    lastMessage?: string;
    lastMessageId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const conversationSchema = new mongoose.Schema<IConversation>(
    {
        groupTitle: {
            type: String,
        },
        members: {
            type: Array,
        },
        lastMessage: {
            type: String,
        },
        lastMessageId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Converation", conversationSchema);
export default Conversation;
