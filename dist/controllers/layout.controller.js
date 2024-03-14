"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayout = exports.editLayout = exports.createLayout = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const layout_model_1 = __importDefault(require("../models/layout.model"));
const redis_1 = require("../utils/redis");
// create layout
exports.createLayout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await layout_model_1.default.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler_1.default(`${type} already exist`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                }
            };
            await layout_model_1.default.create(banner);
            // await redis.set(`Layout-${type}:-`, JSON.stringify({ banner: banner }))
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq?.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.create({ type: "FAQ", faq: faqItems });
            // await redis.set(`Layout-${type}:-`, JSON.stringify({ faq: faqItems }))
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// edit layout 
exports.editLayout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = await layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            const data = image.startsWith('https') ? bannerData : await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                image: {
                    public_id: image.startsWith('https') ? bannerData.banner.image.public_id : data?.public_id,
                    url: image.startsWith('https') ? bannerData.banner.image.url : data?.url,
                },
                title,
                subTitle,
            };
            await layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner });
            await redis_1.redis.set(`Layout-${type}:-`, JSON.stringify({ banner: banner }));
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqData = await layout_model_1.default.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.findByIdAndUpdate(faqData?._id, { type: "FAQ", faq: faqItems });
            await redis_1.redis.set(`Layout-${type}:-`, JSON.stringify({ faq: faqItems }));
        }
        res.status(200).json({
            success: true,
            message: "Layout edited successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get layout
exports.getLayout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layoutData = await redis_1.redis.get(`Layout-${type}:-`);
        if (layoutData) {
            const layout = JSON.parse(layoutData);
            res.status(201).json({
                success: true,
                layout
            });
        }
        else {
            const layout = await layout_model_1.default.findOne({ type });
            res.status(201).json({
                success: true,
                layout
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
