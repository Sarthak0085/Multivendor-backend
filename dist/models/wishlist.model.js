"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistSchema = new mongoose_1.default.Schema({
    products: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
            },
            shopId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Shop',
                // required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            },
            product: Object,
            color: String,
            size: String,
            // name: String,
            price: Number,
            // category: String,
            // tags: String,
            // image: String,
        }
    ],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
const Wishlist = mongoose_1.default.model('Wishlist', wishlistSchema);
exports.default = Wishlist;
