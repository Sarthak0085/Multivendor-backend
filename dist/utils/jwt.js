"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
const redis_1 = require("./redis");
const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES || '120', 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES || '30', 10);
// options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 60 * 1000),
    maxAge: accessTokenExpires * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
};
const sendToken = async (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    //upload session to redis 
    await redis_1.redis.set(`user-${user?._id}:-`, JSON.stringify(user));
    // only set secure to true in production
    // if (process.env.NODE_ENV === 'Production') {
    //     accessTokenOptions.secure = true;
    // } else {
    //     accessTokenOptions.secure = false;
    // }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
exports.sendToken = sendToken;
