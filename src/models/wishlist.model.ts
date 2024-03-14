import mongoose, { Document } from 'mongoose';

export interface IProductInWishlist {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    addedAt: Date;
    color: string;
    size: string;
    price: number;
    product: object;
    // category?: string;
    // tags?: string;
    // name: string;
    // image: string;
}

export interface IWishlist extends Document {
    products: IProductInWishlist[];
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlist>({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            shopId: {
                type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
