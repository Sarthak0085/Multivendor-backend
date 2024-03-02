"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isSeller = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid", 400));
    }
    const user = await redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 400));
    }
    req.user = JSON.parse(user);
    next();
});
exports.isSeller = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const seller_access_token = req.cookies.seller_access_token;
    if (!seller_access_token) {
        return next(new ErrorHandler_1.default("Please login to access this", 400));
    }
    console.log(seller_access_token);
    const decoded = jsonwebtoken_1.default.verify(seller_access_token, process.env.SELLER_ACCESS_TOKEN);
    console.log(decoded);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid", 400));
    }
    const shop = await redis_1.redis.get(decoded.id);
    if (!shop) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 400));
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
exports.isAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (!(req.user?.role === "ADMIN")) {
        return next(new ErrorHandler_1.default("Not Authorized as Admin", 400));
    }
    next();
});
