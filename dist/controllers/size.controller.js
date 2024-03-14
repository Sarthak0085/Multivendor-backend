"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSizes = exports.deleteSize = exports.addNewSize = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const size_model_1 = __importDefault(require("../models/size.model"));
// add new size by admin
exports.addNewSize = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { title, symbol } = req.body;
        const newSize = await size_model_1.default.create({ title, symbol });
        res.status(201).json({
            success: true,
            newSize
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete size by admin
exports.deleteSize = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedSize = await size_model_1.default.findByIdAndDelete(id);
        if (!deletedSize) {
            return next(new ErrorHandler_1.default("Color not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Size Removed successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all sizes
exports.getAllSizes = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const getAllSize = await size_model_1.default.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            getAllSize
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
