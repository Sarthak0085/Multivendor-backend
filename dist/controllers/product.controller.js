"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductsByAdmin = exports.createReview = exports.getAllProducts = exports.deleteShopProduct = exports.getAllProductsOfShopById = exports.updateProduct = exports.createProduct = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
// create product
exports.createProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await shop_model_1.default.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop Id is invalid!", 400));
        }
        else {
            let images = [];
            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            }
            else {
                images = req.body.images;
            }
            const imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary_1.default.v2.uploader.upload(images[i], {
                    folder: "products",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            const productData = req.body;
            productData.images = imagesLinks;
            productData.shop = shop;
            const product = await product_model_1.default.create(productData);
            res.status(201).json({
                success: true,
                product,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update product
exports.updateProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const updatedData = req.body;
        // Check if the product exists
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        // Update the product data
        if (updatedData.images) {
            // Upload new images to cloudinary and update image links
            const newImagesLinks = [];
            for (let i = 0; i < updatedData.images.length; i++) {
                const result = await cloudinary_1.default.v2.uploader.upload(updatedData.images[i], {
                    folder: "products",
                });
                newImagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            updatedData.images = [...product.images, ...newImagesLinks]; // Combine existing and new images
        }
        // Handle image removal
        if (product.images && updatedData.images) {
            // Filter out images that are no longer present in the updated images array
            const removedImages = product.images.filter((image) => !updatedData.images.some((newImage) => newImage.public_id === image.public_id));
            // Here you can handle the removal of images, for example, delete them from the cloud storage
            for (const removedImage of removedImages) {
                // Code to delete images from cloud storage
                await cloudinary_1.default.v2.uploader.destroy(removedImage.public_id);
            }
        }
        // Update other fields
        product.set(updatedData);
        // Save the updated product
        await product.save();
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get all products of a shop
// router.get(
//     "/get-all-products-shop/:id",
exports.getAllProductsOfShopById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find({ shopId: req.params.id });
        res.status(201).json({
            success: true,
            products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete product of a shop
// router.delete(
//     "/delete-shop-product/:id",
//     isSeller,
exports.deleteShopProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        for (let i = 0; 1 < product.images.length; i++) {
            await cloudinary_1.default.v2.uploader.destroy(product.images[i].public_id);
        }
        await product_model_1.default.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "Product Deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error, 400));
    }
});
// get all products
// router.get(
//     "/get-all-products",
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// review for a product
// router.put(
//     "/create-new-review",
//     isAuthenticated,
exports.createReview = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        const review = {
            user,
            rating,
            comment,
            productId,
        };
        const isReviewed = product.reviews.find((rev) => rev.user._id === req.user?._id);
        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user._id === req.user?._id) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        }
        else {
            product.reviews.push(review);
        }
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;
        await product.save({ validateBeforeSave: false });
        await order_model_1.default.findByIdAndUpdate(orderId, { $set: { "cart.$[elem].isReviewed": true } }, { arrayFilters: [{ "elem._id": productId }], new: true });
        res.status(200).json({
            success: true,
            message: "Reviwed succesfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error, 400));
    }
});
// all products --- for admin
// router.get(
//     "/admin-all-products",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.getAllProductsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
