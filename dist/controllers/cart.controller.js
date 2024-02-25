"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartData = exports.emptyCart = exports.removeFromCart = exports.addedToCart = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const redis_1 = require("../utils/redis");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Controller function to toggle adding/removing products to/from the wishlist
// export const addedToCart = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { product, count, shop } = req.body as IProductInCart;
//         const userId = req.user?._id;
//         const user = User.findById(userId);
//         if (!user) {
//             return next(new ErrorHandler("User not found", 404));
//         }
//         // Find the user's wishlist data from Redis
//         let cartData = await redis.get(`Cart-${userId.toString()}:-`);
//         let cart: ICart | null = null;
//         if (!cartData) {
//             // If wishlist data is not found in Redis, fetch it from MongoDB
//             cart = await Cart.findOne({ addedBy: userId });
//         } else {
//             cart = JSON.parse(cartData);
//         }
//         if (!cart) {
//             cart = new Cart({
//                 products: [],
//                 cartTotal: 0,
//                 totalAfterDiscount: 0,
//                 orderBy: userId
//             });
//         }
//         const existingProductIndex = cart.products.findIndex(p => p.product === product);
//         if (existingProductIndex === -1) {
//             // Product not found in cart, remove it
//             cart.cartTotal -= cart.products[existingProductIndex].price * cart.products[existingProductIndex].count;
//             cart.products.splice(existingProductIndex, 1);
//         } else {
//             // Product found in cart, add it
//             cart.products.push({ product: product, shop: shop, count, color, price, size });
//             cart.cartTotal += price * count;
//         }
//         if (existingProductIndex !== -1 || count > 0) {
//             await cart.save();
//             await redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));
//         }
//         res.status(200).json({
//             success: true,
//             message: 'Product added to cart successfully',
//             cart
//         });
//     } catch (error: any) {
//         console.error('Error adding product to cart:', error);
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
const addedToCart = async (req, res, next) => {
    try {
        // Extract the product details from the request body
        const { productId, count, shopId, color, price } = req.body;
        // Get the user ID from the request (assuming it's attached to the request)
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to add item into your cart.", 401));
        }
        // Find the cart data from Redis based on the user ID
        const cartData = await redis_1.redis.get(`Cart-${userId.toString()}:-`);
        let cart = null;
        // If cart data exists in Redis, parse it, otherwise fetch from MongoDB
        if (cartData) {
            cart = JSON.parse(cartData);
        }
        else {
            cart = await cart_model_1.default.findOne({ addedBy: userId });
        }
        // If cart not found, create a new one
        if (!cart) {
            cart = new cart_model_1.default({
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
            cart.products[existingProductIndex].count += count;
        }
        else {
            const product = await product_model_1.default.findById(productId);
            if (!product) {
                return next(new ErrorHandler_1.default("Product not found", 404));
            }
            cart?.products.push({ shopId, productId, product, color, count, price });
        }
        // Update the cart total
        cart.cartTotal += price * count;
        // Save the cart data to MongoDB
        await cart_model_1.default.findOneAndUpdate({ addedBy: userId }, { $addToSet: { products: req.body }, $inc: { cartTotal: price * count } }, { upsert: true });
        // Update the cart data in Redis
        await redis_1.redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));
        // Respond with success message and updated cart data
        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart
        });
    }
    catch (error) {
        console.error('Error adding product to cart:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.addedToCart = addedToCart;
const removeFromCart = async (req, res, next) => {
    try {
        // Extract the product ID from the request
        const { productId } = req.body;
        console.log(productId);
        // Get the user ID from the request
        const userId = req.user?._id;
        // Find the cart in MongoDB
        const cart = await cart_model_1.default.findOne({ addedBy: userId });
        if (!cart) {
            return next(new ErrorHandler_1.default("Cart not found", 404));
        }
        console.log(cart);
        // Find the index of the product in the cart
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
        console.log(productIndex);
        console.log(productIndex);
        if (productIndex === -1) {
            return next(new ErrorHandler_1.default("Product not found in cart", 404));
        }
        // Remove the product from the cart in MongoDB
        const removedProduct = cart.products.splice(productIndex, 1)[0];
        cart.cartTotal -= removedProduct.price * removedProduct.count;
        // Update the cart in MongoDB
        await cart_model_1.default.findOneAndUpdate({ addedBy: userId }, { $pull: { products: { product: productId } }, $inc: { cartTotal: -removedProduct.price * removedProduct.count } });
        // Update the cart data in Redis
        const updatedCart = cart.products.filter((p) => p.product.toString() !== productId.toString());
        cart.products = updatedCart;
        await redis_1.redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart.toObject()));
        // Respond with success message and updated cart data
        res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            cart
        });
    }
    catch (error) {
        console.error('Error removing product from cart:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.removeFromCart = removeFromCart;
// empty the cart 
exports.emptyCart = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params; // Assuming you have user authentication middleware that sets req.user
        // await redis.get(`Cart-${userId.toString()}:-`);
        const cart = await cart_model_1.default.findOneAndDelete({ addedBy: userId });
        await redis_1.redis.del(`Cart-${userId.toString()}:-`);
        res.status(200).json({ success: true, message: 'Cart Emptied successfully', cart });
    }
    catch (error) {
        console.error('Error emptying cart:', error);
        res.status(500).json({ success: false, message: 'Failed to empty cart', error });
    }
});
exports.getCartData = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        // Attempt to retrieve cart data from Redis
        let cartData = await redis_1.redis.get(`Cart-${userId.toString()}:-`);
        if (!cartData) {
            // If cart data is not found in Redis, fetch it from MongoDB
            const cart = await cart_model_1.default.findOne({ addedBy: userId }).populate({
                path: 'products.product',
                populate: {
                    path: 'shopId',
                }
            });
            if (!cart) {
                return next(new ErrorHandler_1.default("Cart not found", 404));
            }
            // Cache cart data in Redis for future use
            await redis_1.redis.set(`Cart-${userId.toString()}:-`, JSON.stringify(cart));
            cartData = JSON.stringify(cart);
        }
        res.status(200).json({ success: true, message: 'Cart data fetched successfully', cart: JSON.parse(cartData) });
    }
    catch (error) {
        console.error('Error getting cart data:', error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
