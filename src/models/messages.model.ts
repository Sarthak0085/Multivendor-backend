import mongoose, { Document } from "mongoose";

interface IMessage extends Document {
    conversationId: string;
    text: string;
    sender: string;
    images?: {
        public_id: string;
        url: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const messagesSchema = new mongoose.Schema<IMessage>(
    {
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
    },
    { timestamps: true }
);

const Messages = mongoose.model<IMessage>("Messages", messagesSchema);
export default Messages;
