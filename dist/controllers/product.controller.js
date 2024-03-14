"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteProductById = exports.getAllProductsByAdmin = exports.createReview = exports.getAllProducts = exports.deleteShopProduct = exports.getProductById = exports.getAllProductsOfShopById = exports.updateProduct = exports.createProduct = void 0;
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
            const originalPrice = productData.originalPrice;
            const discountPrice = productData.discountPrice;
            if (originalPrice && discountPrice && discountPrice < originalPrice) {
                const discountPercent = (1 - (discountPrice / originalPrice)) * 100;
                productData.discountPercent = discountPercent;
            }
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
        const productId = req.body.productId;
        // console.log(req.body);
        const updatedData = req.body;
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        if (req.body.images) {
            // Upload new images to cloudinary and update image links
            const newImagesLinks = [];
            for (let i = 0; i < req.body.images.length; i++) {
                const result = await cloudinary_1.default.v2.uploader.upload(updatedData.images[i], {
                    folder: "products",
                });
                newImagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            updatedData.images = [...product.images, ...newImagesLinks];
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
        const originalPrice = updatedData.originalPrice;
        const discountPrice = updatedData.discountPrice;
        if (originalPrice && discountPrice && discountPrice < originalPrice) {
            const discountPercent = (1 - (discountPrice / originalPrice)) * 100;
            updatedData.discountPercent = discountPercent;
        }
        // Update other fields
        product.set(updatedData);
        // // Save the updated product
        await product.save();
        // const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true })
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
exports.getAllProductsOfShopById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find({ shopId: req.params.id }).sort({
            createdAt: 1, updatedAt: 1,
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
exports.getProductById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("product not found", 404));
        }
        res.status(201).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteShopProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary_1.default.v2.uploader.destroy(product?.images[i]?.public_id);
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
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { category, gender, brand, colors, sizes, prices, discounts, sort } = req.query;
        // console.log("category :", category === "");
        let filters = {};
        if (typeof category === "string" && category !== "") {
            filters.category = { $in: category.split(',') };
        }
        if (typeof gender === "string" && gender !== "") {
            filters.gender = { $in: gender.split(',') };
        }
        if (typeof brand === "string" && brand !== "") {
            filters.brand = { $in: brand.split(',') };
        }
        if (typeof colors === "string" && colors !== "") {
            filters.colors = { $in: colors.split(',') };
        }
        if (typeof sizes === "string" && sizes !== "") {
            filters.sizes = { $in: sizes.split(',') };
        }
        if (typeof prices === "string" && prices !== "") {
            if (prices.includes("+")) {
                const minPriceStr = prices.replace("+", "");
                const minPrice = parseInt(minPriceStr, 10);
                filters.discountPrice = { $gte: minPrice };
            }
            else {
                const [minPriceStr, maxPriceStr] = prices.split('-');
                const minPrice = parseInt(minPriceStr, 10);
                const maxPrice = parseInt(maxPriceStr, 10);
                filters.discountPrice = { $gte: minPrice, $lte: maxPrice };
            }
        }
        if (typeof discounts === "string" && discounts !== "") {
            const [minDiscountStr, maxDiscountStr] = discounts.split('-');
            const minDiscount = parseInt(minDiscountStr, 10);
            const maxDiscount = parseInt(maxDiscountStr, 10);
            filters.discountPercent = { $gte: minDiscount, $lte: maxDiscount };
        }
        let sortBy = {};
        if (sort && sort !== "") {
            switch (sort) {
                case 'Price: Low To High':
                    sortBy = { discountPrice: 1 };
                    break;
                case 'Price: High To Low':
                    sortBy = { discountPrice: -1 };
                    break;
                case 'Discount':
                    sortBy = { discountPercent: -1 };
                    break;
                case 'New Arrivals':
                    sortBy = { createdAt: -1 };
                    break;
                case 'Random':
                    sortBy = { $sample: { size: 10000 } };
                    break;
                case 'Rating':
                    sortBy = { rating: -1 };
                    break;
                default:
                    sortBy = { createdAt: -1 };
                    break;
            }
        }
        else {
            sortBy = { sold_out: -1 };
        }
        const products = await product_model_1.default.find(filters).sort(sortBy);
        res.status(201).json({
            success: true,
            products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
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
exports.getAllProductsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find().sort({
            createdAt: 1, updatedAt: 1
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
exports.adminDeleteProductById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await product_model_1.default.findByIdAndDelete(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
