import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import { Error } from "../models/error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // format errors
    let status = 500
    let message = "Internal server error"
    if ((err.status) && (err.status != 500)) {
        message = err.message
        status = err.status
    }
    console.error(err)
    res.status(status).json({
        message: message,
    });
}