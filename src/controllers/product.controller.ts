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

            const originalPrice = productData.originalPrice;
            const discountPrice = productData.discountPrice;

            if (originalPrice && discountPrice && discountPrice < originalPrice) {
                const discountPercent = (1 - (discountPrice / originalPrice)) * 100;
                productData.discountPercent = discountPercent;
            }

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
        // console.log(req.body);

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

interface FilterQuery {
    category?: string;
    gender?: string;
    brand?: string;
    colors?: string;
    sizes?: string;
    prices?: string;
    discounts?: string;
    sort?: string;
}

export const getAllProducts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, gender, brand, colors, sizes, prices, discounts, sort } = req.query as FilterQuery;
        // console.log("category :", category === "");

        let filters: any = {};

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
            } else {
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

        let sortBy: any = {};
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
        } else {
            sortBy = { sold_out: -1 };
        }

        const products = await Product.find(filters).sort(sortBy);

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