import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Brand from "../models/brand.model";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

// add new brand
export const addNewBrand = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { image, title } = req.body;

        // Upload image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "brand_images",
            width: 150
        });

        // Create category with image details
        const newBrand = await Brand.create({
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update brand by seller
export const updateBrand = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params?._id;
    try {

        const brandExist = await Brand.findById(brandId);

        if (!brandExist) {
            return next(new ErrorHandler("Brand doesn't exist", 404));
        }

        if (req.body.image === null) {
            return next(new ErrorHandler("Avatar not found", 400));
        }

        if (req.body.image && brandExist) {
            // if user already have avatar
            if (brandExist.image?.public_id) {
                cloudinary.v2.uploader.destroy(brandExist?.image?.public_id);

                // then add other avatar
                const myCloud = cloudinary.v2.uploader.upload(req.body.image, {
                    folder: "brand_images",
                    width: 150
                });
                brandExist.image = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                }
            } else {
                const myCloud = cloudinary.v2.uploader.upload(req.body.image, {
                    folder: "brand_images",
                    width: 150
                });
                req.body.image = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                }
            }
        }

        const updatedBrand = await Brand.findByIdAndUpdate(brandId, req.body, {
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete brand by seller
export const deleteBrand = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            return next(new ErrorHandler("Brand not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get brand by id
export const getBrand = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const getBrand = await Brand.findById(id);
        if (!getBrand)
            res.status(201).json({
                success: true,
                getBrand
            });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all brands
export const getallBrand = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getallBrand = await Brand.find();
        res.status(201).json({
            success: true,
            getallBrand
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});