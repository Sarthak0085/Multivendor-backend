import mongoose, { Model, Document } from "mongoose";

interface ICoupon extends Document {
    name: string;
    value: number;
    minAmount?: number;
    maxAmount?: number;
    shopId: string;
    selectedProduct?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema = new mongoose.Schema<ICoupon>({
    name: {
        type: String,
        required: [true, "Please enter your coupon code name!"],
        unique: true,
    },
    value: {
        type: Number,
        required: true,
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    shopId: {
        type: String,
        required: true,
    },
    selectedProduct: {
        type: String,
    },
}, {
    timestamps: true,
});

const Coupon: Model<ICoupon> = mongoose.model("Coupon", couponSchema)

export default Coupon;