import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Shop from "../models/shop.model";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import Product from "../models/product.model";
import Order from "../models/order.model";

// create product
export const createProduct = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Shop Id is invalid!", 400));
        } else {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
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

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update product
export const updateProduct = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.body.productId;
        console.log(req.body);

        const updatedData = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        if (req.body.images) {
            // Upload new images to cloudinary and update image links
            const newImagesLinks = [];
            for (let i = 0; i < req.body.images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(updatedData.images[i], {
                    folder: "products",
                });
                newImagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            updatedData.images = [...product.images, ...newImagesLinks];
        }


        console.log(updatedData);

        // Handle image removal
        if (product.images && updatedData.images) {
            // Filter out images that are no longer present in the updated images array
            const removedImages = product.images.filter((image: any) => !updatedData.images.some((newImage: any) => newImage.public_id === image.public_id));
            // Here you can handle the removal of images, for example, delete them from the cloud storage
            for (const removedImage of removedImages) {
                // Code to delete images from cloud storage
                await cloudinary.v2.uploader.destroy(removedImage.public_id);
            }
        }

        // // Update other fields
        product.set(updatedData);

        // // Save the updated product
        await product.save();
        // const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true })

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllProductsOfShopById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ shopId: req.params.id }).sort({
            createdAt: 1, updatedAt: 1,
        });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getProductById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("product not found", 404));
        }
        res.status(201).json({
            success: true,
            product,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteShopProduct = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(
                product?.images[i]?.public_id
            );
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Product Deleted successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});


export const getAllProducts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find().sort({ createdAt: -1, updatedAt: -1, });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const createReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const review = {
            user,
            rating,
            comment,
            productId,
        };

        const isReviewed = product.reviews.find(
            (rev: any) => rev.user._id === req.user?._id
        );

        if (isReviewed) {
            product.reviews.forEach((rev: any) => {
                if (rev.user._id === req.user?._id) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        } else {
            product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev: { rating: number; }) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
            orderId,
            { $set: { "cart.$[elem].isReviewed": true } },
            { arrayFilters: [{ "elem._id": productId }], new: true }
        );

        res.status(200).json({
            success: true,
            message: "Reviwed succesfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});


export const getAllProductsByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find().sort({
            createdAt: 1, updatedAt: 1
        });
        res.status(201).json({
            success: true,
            products,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const adminDeleteProductById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});