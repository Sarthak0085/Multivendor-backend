import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";
import { redis } from "../utils/redis";

// create layout
export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exist`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;

            const myCloud = await cloudinary.v2.uploader.upload(image, {
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
            }

            await LayoutModel.create(banner);
            await redis.set(`Layout-${type}:-`, JSON.stringify(banner))
        }

        if (type === "FAQ") {
            const { faq } = req.body;

            const faqItems = await Promise.all(
                faq?.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )

            await LayoutModel.create({ type: "FAQ", faq: faqItems });
            await redis.set(`Layout-${type}:-`, JSON.stringify({ faq: faqItems }))
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// edit layout 
export const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;


            const data = image.startsWith('https') ? bannerData : await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            });


            const banner = {
                image: {
                    public_id: image.startsWith('https') ? bannerData.banner.image.public_id : data?.public_id,
                    url: image.startsWith('https') ? bannerData.banner.image.url : data?.url,
                },
                title,
                subTitle,
            }

            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
            await redis.set(`Layout-${type}:-`, JSON.stringify(banner))
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqData = await LayoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )

            await LayoutModel.findByIdAndUpdate(faqData?._id, { type: "FAQ", faq: faqItems });
            await redis.set(`Layout-${type}:-`, JSON.stringify({ faq: faqItems }))
        }

        res.status(200).json({
            success: true,
            message: "Layout edited successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get layout
export const getLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        const layoutData = await redis.get(`Layout-${type}:-`);

        if (layoutData) {
            const layout = JSON.parse(layoutData);
            res.status(201).json({
                success: true,
                layout
            })
        } else {
            const layout = await LayoutModel.findOne({ type });

            res.status(201).json({
                success: true,
                layout
            })
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
