import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import dotenv from "dotenv";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";


export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler("Please login to access this", 400));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new ErrorHandler("Please login to access this resource", 400));
    }

    req.user = JSON.parse(user);

    next();
})

export const isSeller = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const seller_access_token = req.cookies.seller_access_token;

    if (!seller_access_token) {
        return next(new ErrorHandler("Please login to access this", 400));
    }

    console.log(seller_access_token);


    const decoded = jwt.verify(seller_access_token, process.env.SELLER_ACCESS_TOKEN as string) as JwtPayload;

    console.log(decoded);

    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
    }

    const shop = await redis.get(decoded.id);

    if (!shop) {
        return next(new ErrorHandler("Please login to access this resource", 400));
    }

    req.seller = JSON.parse(shop);

    next();
});

console.log("Seller checked");


// export const authorizeRole = (...roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!roles.includes(req.user?.role || '')) {
//             return next(new ErrorHandler(`Role : ${req.user?.role} is not allowed to access this resource`, 400));
//         }

//         next();
//     }
// }

export const isAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (!(req.user?.role === "ADMIN")) {
        return next(new ErrorHandler("Not Authorized as Admin", 400));
    }
    next();
})