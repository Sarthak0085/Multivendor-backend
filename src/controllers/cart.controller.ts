import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import Cart, { ICart, IProductInCart } from "../models/cart.model";
import Product from "../models/product.model";


export const addedToCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, count, shopId, color, price, size, gender } = req.body as IProductInCart;

        // Get the user ID from the request (assuming it's attached to the request)
        const userId = req.user?._id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("Please login to add item into your cart.", 401));
        }

        // Find the cart data from Redis based on the user ID
        const cartData = await redis.get(`Cart-${userId.toString()}:-`);

        let cart: ICart | null = null;

        // If cart data exists in Redis, parse it, otherwise fetch from MongoDB
        if (cartData) {
            cart = JSON.parse(cartData);
        } else {
            cart = await Cart.findOne({ addedBy: userId });
        }

        // If cart not found, create a new one
        if (!cart) {
            cart = new Cart({
                products: [],
                cartTotal: 0,
                addedBy: userId
            });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(p => p?.productId === productId);

        console.log(existingProductIndex);

        // If the product is already in the cart, update its count and total
        if (existingProductIndex !== -1) {

            cart.cartTotal -= cart.products[existingProductIndex].price * cart.products[existingProductIndex].count;

            cart.products[existingProductIndex].count = count;
            cart.products[existingProductIndex].color = color;
            cart.products[existingProductIndex].size = size;

        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return next(new ErrorHandler("Product not found", 404));
            }
            cart?.products.push({ shopId, productId, product, color, count, price, gender, size });
        }

        // Update the cart total
        cart.cartTotal += price * count;

        // Save the cart data to MongoDB
        await Cart.findOneAndUpdate(
            { addedBy: userId },
            { $addToSet: { products: req.body }, $inc: { cartTotal: price * count } },
            { upsert: true }
        );

        // Update the cart data in Redis
        await redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));

        // Respond with success message and updated cart data
        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart
        });
    } catch (error: any) {
        console.error('Error adding product to cart:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});

export const removeFromCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the product ID from the request
        console.log("Remove: ", req.body);

        const { productId } = req.body;


        console.log("productId :", productId);

        // Get the user ID from the request
        const userId = req.user?._id;

        // Find the cart in MongoDB
        const cart = await Cart.findOne({ addedBy: userId });

        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        // console.log(cart);

        // Find the index of the product in the cart
        const productIndex = cart.products.findIndex((p) => p?.productId?.toString() === productId);

        // console.log(cart?.products);

        // console.log(productIndex);


        if (productIndex === -1) {
            return next(new ErrorHandler("Product not found in cart", 404));
        }

        cart.cartTotal -= cart.products[productIndex].price * cart.products[productIndex].count;

        // Remove the product from the cart in MongoDB
        const removedProduct = cart.products.splice(productIndex, 1)[0];
        // cart.cartTotal -= removedProduct.price * removedProduct.count;

        // Update the cart in MongoDB
        await Cart.findOneAndUpdate(
            { addedBy: userId },
            { products: cart.products, cartTotal: cart.cartTotal },
            { upsert: true }
        );

        // Update the cart data in Redis
        // const updatedCart = cart.products.filter((p) => p?.product?.toString() !== productId);
        // cart.products = updatedCart;
        await redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));

        // Respond with success message and updated cart data
        res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            cart
        });
    } catch (error: any) {
        console.error('Error removing product from cart:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});


// empty the cart 
export const emptyCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params; // Assuming you have user authentication middleware that sets req.user

        // await redis.get(`Cart-${userId.toString()}:-`);

        const cart = await Cart.findOneAndDelete({ addedBy: userId });

        await redis.del(`Cart-${userId.toString()}:-`);

        res.status(200).json({ success: true, message: 'Cart Emptied successfully', cart });
    } catch (error) {
        console.error('Error emptying cart:', error);
        res.status(500).json({ success: false, message: 'Failed to empty cart', error });
    }
});

export const getCartData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        // Attempt to retrieve cart data from Redis
        let cartData = await redis.get(`Cart-${userId.toString()}:-`);

        if (!cartData) {
            // If cart data is not found in Redis, fetch it from MongoDB
            const cart = await Cart.findOne({ addedBy: userId }).populate({
                path: 'products.product',
                populate: {
                    path: 'shopId',
                }
            });

            if (!cart) {
                return next(new ErrorHandler("Cart not found", 404));
            }

            // Cache cart data in Redis for future use
            await redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));
            cartData = JSON.stringify(cart);
        }

        res.status(200).json({ success: true, message: 'Cart data fetched successfully', cart: JSON.parse(cartData) });
    } catch (error: any) {
        console.error('Error getting cart data:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});
