import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Wishlist, { IProductInWishlist, IWishlist } from "../models/wishlist.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import Product from "../models/product.model";
import User from "../models/user.model";

// Controller function to toggle adding/removing products to/from the wishlist
export const toggleWishlist = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, shopId, color, price } = req.body as IProductInWishlist;
        const userId = req.user?._id;
        console.log(productId);

        const user = await User.findById(userId);


        if (!user) {
            return next(new ErrorHandler("User not Authenticated", 401));
        }

        let wishlistData = await redis.get(`Wishlist-${userId.toString()}:-`);

        let wishlist;

        if (!wishlistData) {
            wishlist = await Wishlist.findOne({ userId: userId });
        } else {
            wishlist = JSON.parse(wishlistData);
        }
        console.log(wishlist);


        if (!wishlist) {
            wishlist = new Wishlist({
                products: [],
                userId: userId
            });
        }

        const existingProductIndex = wishlist?.products.findIndex((p: any) => p?.product?._id.toString() === productId);

        if (existingProductIndex === -1) {
            const product = await Product.findById(productId);
            if (!product) {
                return next(new ErrorHandler("Product not found", 404));
            }
            wishlist?.products.push({ shopId, product, color, price });
        } else {
            wishlist.products.splice(existingProductIndex, 1);
        }

        console.log(wishlist);


        await Wishlist.findOneAndUpdate(
            { userId: userId },
            { products: wishlist?.products },
            { upsert: true, new: true }
        );
        await redis.set(`Wishlist-${userId.toString()}:-`, JSON.stringify(wishlist));

        res.status(200).json({
            success: true,
            message: 'Wishlist updated successfully',
            wishlist
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// empty the wishlist 
export const emptyWishlist = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        // await redis.get(`Wishlist-${userId.toString()}:-`);

        const wishlist = await Wishlist.findOneAndDelete({ userId: userId });

        await redis.del(`Wishlist-${userId.toString()}:-`);

        res.status(200).json({ success: true, message: 'Wishlist Emptied successfully', wishlist });
    } catch (error: any) {
        console.error('Error emptying Wishlist:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// get wishlist data
export const getWishlistData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        let wishlistData = await redis.get(`Wishlist-${userId.toString()}:-`);

        if (!wishlistData) {
            const wishlist = await Wishlist.findOne({ userId: userId }).populate({
                path: 'products.productId',
                select: '_id name discountPrice category images tags color',
                populate: {
                    path: 'shop',
                    select: '_id name',
                }
            });

            console.log(wishlist);


            if (!wishlist) {
                return next(new ErrorHandler("Wishlist not found", 404));
            }

            await redis.set(`Wishlist-${userId.toString()}:-`, JSON.stringify(wishlist));
            wishlistData = JSON.stringify(wishlist);
        }

        res.status(200).json({ success: true, message: 'Wishlist data fetched successfully', wishlist: JSON.parse(wishlistData) });
    } catch (error: any) {
        console.error('Error getting Wishlist data:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});