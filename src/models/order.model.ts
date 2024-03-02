import mongoose, { Document } from "mongoose";
import { ICart } from "./cart.model";

interface IPaymentInfo extends Document {
    id: string;
    type: string;
    status: string;
}

interface IOrder extends Document {
    cart: [];
    shippingAddress: object;
    user: object;
    userId: string;
    totalPrice: number;
    status: "Processing" | "Refund Success" | "Transferred to delivery partner" | "Received" | "Delivered" | "On the way" | "Shipping" | "Processing Refund";
    paymentInfo: IPaymentInfo;
    paidAt: Date;
    deliveredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    cart: [
        {
            type: Array,
            required: true,
        }
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Processing", "Refund Success", "Transferred to delivery partner", "Received", "Delivered", "On the way", "Shipping", "Processing Refund"],
        default: "Processing",
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;