"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for the cart
const cartSchema = new mongoose_1.default.Schema({
    products: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
            },
            shopId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true,
});
const Cart = mongoose_1.default.model("Cart", cartSchema);
exports.default = Cart;
