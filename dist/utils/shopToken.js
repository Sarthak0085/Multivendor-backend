"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendShopToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
const redis_1 = require("./redis");
const accessTokenExpires = parseInt(process.env.ACCESS_SHOP_TOKEN_EXPIRES || '120', 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_SHOP_TOKEN_EXPIRES || '30', 10);
// options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 60 * 1000),
    maxAge: accessTokenExpires * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'Production' ? "none" : "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'Production' ? "none" : "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
};
const sendShopToken = async (seller, statusCode, res) => {
    const accessToken = seller.SignAccessToken();
    const refreshToken = seller.SignRefreshToken();
    //upload session to redis 
    await redis_1.redis.set(`shop-${seller._id}:-`, JSON.stringify(seller));
    res.cookie("seller_access_token", accessToken, exports.accessTokenOptions);
    res.cookie("seller_refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        seller,
        accessToken
    });
};
exports.sendShopToken = sendShopToken;
