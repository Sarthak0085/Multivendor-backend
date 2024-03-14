import mongoose, { Document, Model } from "mongoose";
// import { IProduct } from "./productModel";

// Define the interface for the product details in the cart
export interface IProductInCart {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    color: string;
    count: number;
    size?: string;
    price: number;
    gender?: string;
    product: object;
}

// Define the interface for the cart document
export interface ICart extends Document {
    products: IProductInCart[];
    cartTotal: number;
    // totalAfterDiscount: number;
    addedBy: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema for the cart
const cartSchema = new mongoose.Schema<ICart>({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            shopId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shop",
                required: true,
            },
            product: {
                type: Object,
            },
            color: {
                type: String,
                required: true,
            },
            size: {
                type: String,
            },
            gender: {
                type: String,
            },
            count: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    cartTotal: {
        type: Number,
        default: 0,
    },
    // totalAfterDiscount: {
    //     type: Number,
    //     required: true,
    //     default: 0,
    // },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
    {
        timestamps: true,
    });

const Cart: Model<ICart> = mongoose.model("Cart", cartSchema);

export default Cart;
