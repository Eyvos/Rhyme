import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { IUser } from "../models/user";
import { UserTable } from '../DB/DataAccess';

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token) 
            throw new Error('No token provided');

        let tokenKey = process.env.TOKEN_KEY;
        if (!tokenKey) 
            throw new Error('Token key not found');

        const user = jwt.verify(token, tokenKey) as IUser;
        const isUserExist = (await UserTable.findOne({ where: { id: user.id, isAdmin: true } })) != null;
        if (!isUserExist) 
            throw new Error('Invalid token');

        next();
    } catch (error) {
        res.status(401).json({ message: "Authenticated route, identify yourself with a valid JWT." });
    }
}