import mongoose, { Document } from "mongoose";

interface IWithdraw extends Document {
    seller: mongoose.Types.ObjectId | object;
    amount: number;
    status: "PENDING" | "SUCCEEDED";
    createdAt?: Date;
    updatedAt?: Date;
}

const withdrawSchema = new mongoose.Schema<IWithdraw>(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "PENDING",
        },
    },
    { timestamps: true }
);

const Withdraw = mongoose.model<IWithdraw>("Withdraw", withdrawSchema);

export default Withdraw;
