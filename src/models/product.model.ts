import mongoose, { Document, Model } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    category: string;
    tags?: string;
    originalPrice?: number;
    discountPrice?: number;
    size?: string | number;
    stock: number;
    colors: string[];
    images: {
        public_id: string;
        url: string;
    }[];
    reviews: {
        user: object;
        rating: number;
        comment: string;
        productId: string;
        createdAt?: Date;
    }[];
    ratings?: number;
    shopId: string;
    shop: object;
    sold_out?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
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
    size: {
        type: String,
    },
    originalPrice: {
        type: Number,
        required: [true, "Please enter a original price."],
    },
    discountPrice: {
        type: Number,
    },
    // price: {
    //     type: Number,
    //     required: [true, "Please enter a Price"],
    // },
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

const Product: Model<IProduct> = mongoose.model("Product", productSchema);

export default Product;