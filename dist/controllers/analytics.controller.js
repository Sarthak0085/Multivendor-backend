"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWithdrawsAnalytics = exports.getCouponsAnalytics = exports.getOrdersAnalytics = exports.getEventsAnalytics = exports.getProductsAnalytics = exports.getUsersAnalytics = exports.getShopAnalytics = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const withdraw_model_1 = __importDefault(require("../models/withdraw.model"));
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
// // get user 12 months analytics
// export const getUsersLast12MonthsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await generateLast12MonthsData(User);
//         res.status(201).json({
//             success: true,
//             users
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get user last 30 days analytics
// export const getUserLast30DaysAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await generateLast30DaysData(User);
//         res.status(201).json({
//             success: true,
//             users
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get user 24 hours analytics
// export const getUserLast24HoursAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await generateLast24HoursData(User);
//         res.status(201).json({
//             success: true,
//             users
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get shop last 12 months analytics
// export const getShopLast12MonthsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const shops = await generateLast12MonthsData(Shop);
//         res.status(201).json({
//             success: true,
//             shops
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get shop last 30 days analytics
// export const getShopLast30DaysAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const shops = await generateLast30DaysData(Shop);
//         res.status(201).json({
//             success: true,
//             shops
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get shop 24 hours analytics
// export const getShopLast24HoursAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const shops = await generateLast24HoursData(Shop);
//         res.status(201).json({
//             success: true,
//             shops
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 12 months order analytics
// export const getLast12MonthsOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const orders = await generateLast12MonthsData(Order);
//         res.status(201).json({
//             success: true,
//             orders
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get last 30 days orders analytics
// export const getLast30DaysOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const orders = await generateLast30DaysData(Order);
//         res.status(201).json({
//             success: true,
//             orders
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 24 hours orders analytics
// export const getLast24HoursOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const orders = await generateLast24HoursData(Order);
//         res.status(201).json({
//             success: true,
//             orders
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 12 months products analytics
// export const getLast12MonthsProductAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const products = await generateLast12MonthsData(Product);
//         res.status(201).json({
//             success: true,
//             products
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get last 30 days products analytics
// export const getLast30DaysProductsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const products = await generateLast30DaysData(Product);
//         res.status(201).json({
//             success: true,
//             products
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 24 hours products analytics
// export const getLast24HoursProductsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const products = await generateLast24HoursData(Product);
//         res.status(201).json({
//             success: true,
//             products
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 12 months event analytics
// export const getLast12MonthsEventsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const events = await generateLast12MonthsData(Event);
//         res.status(201).json({
//             success: true,
//             events
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get last 30 days events analytics
// export const getLast30DaysEventsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const events = await generateLast30DaysData(Event);
//         res.status(201).json({
//             success: true,
//             events
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 24 hours events analytics
// export const getLast24HoursEventsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const events = await generateLast24HoursData(Event);
//         res.status(201).json({
//             success: true,
//             events
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 12 months withdraw analytics
// export const getLast12MonthsWithdrawAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const withdraws = await generateLast12MonthsData(Withdraw);
//         res.status(201).json({
//             success: true,
//             withdraws
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get last 30 days withdraws analytics
// export const getLast30DaysWithdrawsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const withdraws = await generateLast30DaysData(Withdraw);
//         res.status(201).json({
//             success: true,
//             withdraws
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 24 hours withdraws analytics
// export const getLast24HoursWithdrawsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const withdraws = await generateLast24HoursData(Withdraw);
//         res.status(201).json({
//             success: true,
//             withdraws
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get 12 months coupon analytics
// export const getLast12MonthsCouponAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const coupons = await generateLast12MonthsData(Coupon);
//         res.status(201).json({
//             success: true,
//             coupons
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// //get last 30 days coupons analytics
// export const getLast30DaysCouponsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const coupons = await generateLast30DaysData(Coupon);
//         res.status(201).json({
//             success: true,
//             coupons
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
// // get last 24 hours coupons analytics
// export const getLast24HoursCouponsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const coupons = await generateLast24HoursData(Coupon);
//         res.status(201).json({
//             success: true,
//             coupons
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });
var TimeFrame;
(function (TimeFrame) {
    TimeFrame["Last12Months"] = "last12Months";
    TimeFrame["Last30Days"] = "last30Days";
    TimeFrame["Last24Hours"] = "last24Hours";
})(TimeFrame || (TimeFrame = {}));
// get Shop Analytics
exports.getShopAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(shop_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(shop_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(shop_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            shops: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get users analytics
exports.getUsersAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(user_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(user_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(user_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            users: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get products analytics
exports.getProductsAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(product_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(product_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(product_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            products: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get events analytics
exports.getEventsAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(event_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(event_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(event_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            events: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get orders analytics
exports.getOrdersAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(order_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(order_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(order_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            orders: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get coupons analytics
exports.getCouponsAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(coupon_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(coupon_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(coupon_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            coupons: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get withdraws analytics
exports.getWithdrawsAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;
        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await (0, analytics_generator_1.generateLast12MonthsData)(withdraw_model_1.default);
        }
        else if (timeFrame === 'last30Days') {
            analytics = await (0, analytics_generator_1.generateLast30DaysData)(withdraw_model_1.default);
        }
        else if (timeFrame === 'last24Hours') {
            analytics = await (0, analytics_generator_1.generateLast24HoursData)(withdraw_model_1.default);
        }
        else {
            return next(new ErrorHandler_1.default("Invalid TimeFrame.", 400));
        }
        res.status(200).json({
            success: true,
            withdraws: analytics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
