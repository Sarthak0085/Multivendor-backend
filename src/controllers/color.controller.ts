import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Color from "../models/color.model";

// add new color by admin
export const addNewColor = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        console.log(title);

        const newColor = await Color.create({ title });
        res.status(201).json({
            success: true,
            newColor
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete color by admin
export const deleteColor = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedColor = await Color.findByIdAndDelete(id);
        if (!deletedColor) {
            return next(new ErrorHandler("Color not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Color deleted successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all color
export const getAllColor = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAllColor = await Color.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            getAllColor
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});