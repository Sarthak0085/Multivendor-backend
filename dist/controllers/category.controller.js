"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallCategory = exports.getCategory = exports.deleteCategory = exports.updateCategory = exports.addNewCategory = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const category_model_1 = __importDefault(require("../models/category.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// add new category by admin
exports.addNewCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { image, title } = req.body;
        // Upload image to Cloudinary
        const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
            folder: "category_images",
            width: 150
        });
        // Create category with image details
        const newCategory = await category_model_1.default.create({
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update category by admin
exports.updateCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    const { title, image } = req.body;
    try {
        const category = await category_model_1.default.findById(id);
        if (!category) {
            return next(new ErrorHandler_1.default("Category not found", 404));
        }
        if (image) {
            // Upload new image to Cloudinary
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "category_images",
                width: 150
            });
            await cloudinary_1.default.v2.uploader.destroy(category.image.public_id);
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete category by admin
exports.deleteCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCategory = await category_model_1.default.findByIdAndDelete(id);
        if (!deletedCategory) {
            return next(new ErrorHandler_1.default("Brand not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Category deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get category by id
exports.getCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const getCategory = await category_model_1.default.findById(req.params.id);
        if (!getCategory) {
            return next(new ErrorHandler_1.default("Category not found", 404));
        }
        res.status(201).json({
            success: true,
            category: getCategory
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all category
exports.getallCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const getallCategory = await category_model_1.default.find().sort({ createdAt: 1, updatedAt: 1 });
        res.status(201).json({
            success: true,
            getallCategory
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
