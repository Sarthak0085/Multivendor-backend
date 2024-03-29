"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllColor = exports.deleteColor = exports.addNewColor = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const color_model_1 = __importDefault(require("../models/color.model"));
// add new color by admin
exports.addNewColor = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { title } = req.body;
        console.log(title);
        const newColor = await color_model_1.default.create({ title });
        res.status(201).json({
            success: true,
            newColor
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete color by admin
exports.deleteColor = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedColor = await color_model_1.default.findByIdAndDelete(id);
        if (!deletedColor) {
            return next(new ErrorHandler_1.default("Color not found", 404));
        }
        res.status(201).json({
            success: true,
            message: "Color deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all color
exports.getAllColor = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const getAllColor = await color_model_1.default.find().sort({ createdAt: -1, updatedAt: -1 });
        res.status(201).json({
            success: true,
            getAllColor
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
