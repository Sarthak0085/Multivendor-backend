import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Size from "../models/size.model";

// add new size by admin
export const addNewSize = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, symbol } = req.body;

        const newSize = await Size.create({ title, symbol });
        res.status(201).json({
            success: true,
            newSize
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete size by admin
export const deleteSize = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedSize = await Size.findByIdAndDelete(id);
        if (!deletedSize) {
            return next(new ErrorHandler("Color not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Size Removed successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all sizes
export const getAllSizes = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAllSize = await Size.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            getAllSize
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});