"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlistData = exports.emptyWishlist = exports.toggleWishlist = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const redis_1 = require("../utils/redis");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Controller function to toggle adding/removing products to/from the wishlist
exports.toggleWishlist = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { productId, shopId, color, price } = req.body;
        const userId = req.user?._id;
        console.log(productId);
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not Authenticated", 401));
        }
        let wishlistData = await redis_1.redis.get(`Wishlist-${userId.toString()}:-`);
        let wishlist;
        if (!wishlistData) {
            wishlist = await wishlist_model_1.default.findOne({ userId: userId });
        }
        else {
            wishlist = JSON.parse(wishlistData);
        }
        console.log(wishlist);
        if (!wishlist) {
            wishlist = new wishlist_model_1.default({
                products: [],
                userId: userId
            });
        }
        const existingProductIndex = wishlist?.products.findIndex((p) => p?.product?._id.toString() === productId);
        if (existingProductIndex === -1) {
            // wishlist.products.push(req.body);
            const product = await product_model_1.default.findById(productId);
            if (!product) {
                return next(new ErrorHandler_1.default("Product not found", 404));
            }
            wishlist?.products.push({ shopId, product, color, price });
        }
        else {
            wishlist.products.splice(existingProductIndex, 1);
        }
        console.log(wishlist);
        await wishlist_model_1.default.findOneAndUpdate({ userId: userId }, { products: wishlist?.products }, { upsert: true, new: true });
        await redis_1.redis.set(`Wishlist-${userId.toString()}:-`, JSON.stringify(wishlist));
        res.status(200).json({
            success: true,
            message: 'Wishlist updated successfully',
            wishlist
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// empty the wishlist 
exports.emptyWishlist = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        // await redis.get(`Wishlist-${userId.toString()}:-`);
        const wishlist = await wishlist_model_1.default.findOneAndDelete({ userId: userId });
        await redis_1.redis.del(`Wishlist-${userId.toString()}:-`);
        res.status(200).json({ success: true, message: 'Wishlist Emptied successfully', wishlist });
    }
    catch (error) {
        console.error('Error emptying Wishlist:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get wishlist data
exports.getWishlistData = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        let wishlistData = await redis_1.redis.get(`Wishlist-${userId.toString()}:-`);
        if (!wishlistData) {
            const wishlist = await wishlist_model_1.default.findOne({ userId: userId }).populate({
                path: 'products.productId',
                select: '_id name discountPrice category images tags color',
                populate: {
                    path: 'shop',
                    select: '_id name',
                }
            });
            console.log(wishlist);
            if (!wishlist) {
                return next(new ErrorHandler_1.default("Wishlist not found", 404));
            }
            await redis_1.redis.set(`Wishlist-${userId.toString()}:-`, JSON.stringify(wishlist));
            wishlistData = JSON.stringify(wishlist);
        }
        res.status(200).json({ success: true, message: 'Wishlist data fetched successfully', wishlist: JSON.parse(wishlistData) });
    }
    catch (error) {
        console.error('Error getting Wishlist data:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
