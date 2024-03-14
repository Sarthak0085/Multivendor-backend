"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your product name!"],
    },
    description: {
        type: String,
        required: [true, "Please enter your product description!"],
    },
    category: {
        type: String,
        required: [true, "Please enter your product category!"],
    },
    tags: {
        type: String,
    },
    gender: {
        type: String,
        required: [true, "Please Select a Gender"],
    },
    brand: {
        type: String,
        required: [true, "Please Select a Brand"],
    },
    sizes: [
        {
            type: String,
            required: [true, "Please Select the Sizes."],
        }
    ],
    originalPrice: {
        type: Number,
        required: [true, "Please enter a original price."],
    },
    discountPrice: {
        type: Number,
    },
    stock: {
        type: Number,
        required: [true, "Please enter your product stock!"],
    },
    colors: [
        {
            type: String,
            required: [true, "Please select the colors"],
        }
    ],
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    reviews: [
        {
            user: {
                type: Object,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            productId: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            }
        },
    ],
    ratings: {
        type: Number,
    },
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    sold_out: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
