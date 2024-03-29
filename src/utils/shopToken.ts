import { NextFunction, Response } from "express";
import { redis } from "./redis";
import { IShop } from "../models/shop.model";

interface ITokenOptions {
    expires: Date,
    maxAge: number,
    httpOnly: boolean,
    sameSite: 'lax' | 'strict' | 'none',
    secure: boolean
}

const accessTokenExpires = parseInt(process.env.ACCESS_SHOP_TOKEN_EXPIRES || '120', 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_SHOP_TOKEN_EXPIRES || '30', 10);


// options for cookies
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 60 * 1000),
    maxAge: accessTokenExpires * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'Production' ? "none" : "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
}


export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'Production' ? "none" : "lax",
    secure: process.env.NODE_ENV === 'Production' ? true : false,
}

export const sendShopToken = async (seller: IShop, statusCode: number, res: Response) => {
    const accessToken = seller.SignAccessToken();
    const refreshToken = seller.SignRefreshToken();

    //upload session to redis 
    await redis.set(`shop-${seller._id}:-`, JSON.stringify(seller));

    res.cookie("seller_access_token", accessToken, accessTokenOptions);
    res.cookie("seller_refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        seller,
        accessToken
    })
}

