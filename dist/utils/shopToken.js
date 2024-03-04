"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendShopToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
const redis_1 = require("./redis");
const accessTokenExpires = parseInt(process.env.ACCESS_SHOP_TOKEN_EXPIRES || '120', 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_SHOP_TOKEN_EXPIRES || '360', 10);
// options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 60 * 1000),
    maxAge: accessTokenExpires * 60 * 1000,
    httpOnly: true,
    sameSite: "none"
};
console.log("access: ", exports.accessTokenOptions);
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
};
console.log("access: ", exports.refreshTokenOptions);
const sendShopToken = (seller, statusCode, res) => {
    const accessToken = seller.SignAccessToken();
    const refreshToken = seller.SignRefreshToken();
    //upload session to redis 
    redis_1.redis.set(seller._id, JSON.stringify(seller));
    // only set secure to true in production
    if (process.env.NODE_ENV === 'Production') {
        exports.accessTokenOptions.secure = true;
    }
    res.cookie("seller_access_token", accessToken, exports.accessTokenOptions);
    res.cookie("seller_refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        seller,
        accessToken
    });
};
exports.sendShopToken = sendShopToken;
