import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import Shop from "../models/shop.model";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData, generateLast24HoursData, generateLast30DaysData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Product from "../models/product.model";
import Withdraw from "../models/withdraw.model";
import Coupon from "../models/coupon.model";
import Order from "../models/order.model";
import Event from "../models/event.model";

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

enum TimeFrame {
    Last12Months = "last12Months",
    Last30Days = "last30Days",
    Last24Hours = "last24Hours"
}

// get Shop Analytics
export const getShopAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Shop);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Shop);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Shop);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            shops: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get users analytics
export const getUsersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(User);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(User);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(User);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            users: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get products analytics
export const getProductsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Product);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Product);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Product);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            products: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get events analytics
export const getEventsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Event);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Event);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Event);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            events: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

//get orders analytics
export const getOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Order);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Order);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Order);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            orders: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get coupons analytics
export const getCouponsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Coupon);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Coupon);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Coupon);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            coupons: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

//get withdraws analytics
export const getWithdrawsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the time frame from the request query parameters
        const { timeFrame } = req.query;

        // Check if the time frame is valid
        let analytics;
        if (timeFrame === 'last12Months') {
            analytics = await generateLast12MonthsData(Withdraw);
        } else if (timeFrame === 'last30Days') {
            analytics = await generateLast30DaysData(Withdraw);
        } else if (timeFrame === 'last24Hours') {
            analytics = await generateLast24HoursData(Withdraw);
        } else {
            return next(new ErrorHandler("Invalid TimeFrame.", 400));
        }

        res.status(200).json({
            success: true,
            withdraws: analytics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});