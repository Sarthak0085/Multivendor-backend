import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Category from "../models/category.model";
import cloudinary from "cloudinary";

// add new category by admin
export const addNewCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { image, title } = req.body;

        // Upload image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "category_images",
            width: 150
        });

        // Create category with image details
        const newCategory = await Category.create({
            title,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        });
        res.status(201).json({
            success: true,
            newCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update category by admin
export const updateCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, image } = req.body;
    try {
        const category = await Category.findById(id);

        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }

        if (image) {
            // Upload new image to Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "category_images",
                width: 150
            });

            await cloudinary.v2.uploader.destroy(category.image.public_id);

            category.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        if (title) {
            category.title = title;
        }

        await category.save();

        res.status(201).json({
            success: true,
            updatedCategory: category
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete category by admin
export const deleteCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return next(new ErrorHandler("Brand not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get category by id
export const getCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getCategory = await Category.findById(req.params.id);
        if (!getCategory) {
            return next(new ErrorHandler("Category not found", 404));
        }
        res.status(201).json({
            success: true,
            category: getCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all category
export const getallCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getallCategory = await Category.find().sort({ createdAt: 1, updatedAt: 1 });
        res.status(201).json({
            success: true,
            getallCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});