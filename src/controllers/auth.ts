import { AuthService } from '../services/auth';
import { Error } from '../models/error';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthController {
    public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokenKey = process.env.TOKEN_KEY;
            if (!tokenKey) {
                throw new Error('Token key not found', 500);
            }

            const salt = process.env.SALT;
            if (!salt) {
                throw new Error('Salt not found', 500);
            }
            const hash = bcrypt.hashSync(req.body.password, salt);
            const user = await AuthService.login(req.body.email, hash);
            let token = jwt.sign({ user }, tokenKey, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login successful',
                token: token,
                user
            });
        } catch (err) {
            next(err)
        };
    }

    public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokenKey = process.env.TOKEN_KEY;
            if (!tokenKey) {
                throw new Error('Token key not found', 500);
            }

            const salt = process.env.SALT;
            if (!salt) {
                throw new Error('Salt not found', 500);
            }
            const password = req.body.password;
            if (!password) {
                throw new Error('Password must be entered', 422);
            }

            const username = req.body.username;
            if (!username) {
                throw new Error('Username must be entered', 422);
            }
            const email = req.body.email;
            if (!email) {
                throw new Error('Email must be entered', 422);
            }
            const hash = bcrypt.hashSync(password, salt);
            const user = await AuthService.register(req.body.username, req.body.email, hash);
            let token = jwt.sign({ user }, tokenKey, { expiresIn: '1h' });

            res.status(200).json({
                message: 'User created successfully',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    updatedAt: user.updatedAt,
                    createdAt: user.createdAt
                }
            });
        } catch (err) {
            next(err); // Passe l'erreur au middleware d'erreur global
        }
    }
}