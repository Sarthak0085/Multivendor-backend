import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";


export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resources not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


    //Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} found`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token entered is invalid. Try Again`;
        err = new ErrorHandler(message, 400);
    }

    // jwt token expired
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired. Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}