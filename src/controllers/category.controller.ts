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
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedCategory) {
            return next(new ErrorHandler("Category not found", 404));
        }

        res.status(201).json({
            success: true,
            updatedCategory
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
    const { id } = req.params;
    try {
        const getCategory = await Category.findById(id);
        if (!getCategory)
            res.status(201).json({
                success: true,
                getCategory
            });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all category
export const getallCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getallCategory = await Category.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            getallCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});