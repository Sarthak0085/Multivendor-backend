"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallBrand = exports.getBrand = exports.deleteBrand = exports.updateBrand = exports.addNewBrand = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// add new brand
exports.addNewBrand = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { image, title } = req.body;
        // Upload image to Cloudinary
        const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
            folder: "brand_images",
            width: 150
        });
        // Create category with image details
        const newBrand = await brand_model_1.default.create({
            title,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        });
        res.status(201).json({
            success: true,
            newBrand
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update brand by seller
exports.updateBrand = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const brandId = req.params?._id;
    try {
        const brandExist = await brand_model_1.default.findById(brandId);
        if (!brandExist) {
            return next(new ErrorHandler_1.default("Brand doesn't exist", 404));
        }
        if (req.body.image === null) {
            return next(new ErrorHandler_1.default("Avatar not found", 400));
        }
        if (req.body.image && brandExist) {
            // if user already have avatar
            if (brandExist.image?.public_id) {
                cloudinary_1.default.v2.uploader.destroy(brandExist?.image?.public_id);
                // then add other avatar
                const myCloud = cloudinary_1.default.v2.uploader.upload(req.body.image, {
                    folder: "brand_images",
                    width: 150
                });
                brandExist.image = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
            else {
                const myCloud = cloudinary_1.default.v2.uploader.upload(req.body.image, {
                    folder: "brand_images",
                    width: 150
                });
                req.body.image = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
        }
        const updatedBrand = await brand_model_1.default.findByIdAndUpdate(brandId, req.body, {
            new: true,
        });
        // await brandExist?.save();
        // if (!updateBrand) {
        //     return next(new ErrorHandler("Brand not found", 404));
        // }
        res.status(201).json({
            success: true,
            updatedBrand
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete brand by seller
exports.deleteBrand = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedBrand = await brand_model_1.default.findByIdAndDelete(id);
        if (!deletedBrand) {
            return next(new ErrorHandler_1.default("Brand not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Brand deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get brand by id
exports.getBrand = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const getBrand = await brand_model_1.default.findById(id);
        if (!getBrand)
            res.status(201).json({
                success: true,
                getBrand
            });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all brands
exports.getallBrand = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const getallBrand = await brand_model_1.default.find();
        res.status(201).json({
            success: true,
            getallBrand
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
