import { UserService } from '../services/user';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { Error } from '../models/error';
import { IUser } from '../models/user';
import bcrypt from 'bcrypt';

export class UserController {
    static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let page = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        let username = req.query.username as string ?? ''; // default is empty string        
        await UserService.findAll(username, page, limit).then(users => {
            res.status(200).json(users);
        }).catch((err: Error) => {
            next(err);
        });
    }

    static getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let id = parseInt(req.params.id ?? '');
        if (isNaN(id)) {
            throw new Error(`User '${id}' not found`, 400);
        }
        await UserService.findOne(id).then(user => {
            res.status(200).json(user);
        }).catch((err: Error) => {
            next(err);
        });
    }

    static changeUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        if (!token) {
            throw new Error('Token is required', 401);
        }
        const tokenKey = process.env.TOKEN_KEY;
        if (!tokenKey) {
            throw new Error('Token key is not set', 500);
        }
        const username = req.body.username as string;
        if (!username) {
            throw new Error('Username is required', 400);
        }
        const userDecoded = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
        const userId = userDecoded.id;
        if (!userId) {
            throw new Error('User ID not found', 422);
        }
        await UserService.changeUsername(userId, userDecoded.email, username).then(() => {
            res.status(200).send('Username changed successfully');
        }).catch((err: Error) => {
            next(err);
        });
    }

    static changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const tokenKey = process.env.TOKEN_KEY;
        if (!tokenKey) {
            throw new Error('Token key is not set', 500);
        }

        const salt = process.env.SALT;
        if (!salt) {
            throw new Error('Salt is not set', 500);
        }
        const userDecoded = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
        const newHash = bcrypt.hashSync(req.body.password, process.env.SALT ?? '');
        const userId = userDecoded.id;
        if (!userId) {
            throw new Error('User ID not found', 422);
        }
        await UserService.changePassword(userId, userDecoded.email, newHash).then(() => {
            res.status(200).send('Password changed successfully');
        }).catch((err: Error) => {
            next(err);
        });
    }

    static changeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        if (!token) {
            throw new Error('Token is required', 401);
        }
        const userDecoded = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
        const image = req.body.image as string;
        if (!image) {
            throw new Error('Image is required', 400);
        }
        const userId = userDecoded.id;
        if (!userId) {
            throw new Error('User ID not found', 422);
        }
        await UserService.changeImage(userId, userDecoded.email, image).then(() => {
            res.status(200).send('Image changed successfully');
        }).catch((err: Error) => {
            next(err);
        });
    }

    static deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        if (!token) {
            throw new Error('Token is required', 401);
        }
        const userDecoded = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
        const userId = userDecoded.id;
        if (!userId) {
            throw new Error('User ID not found', 422);
        }
        await UserService.deleteUserFromDb(userId).then(() => {
            res.status(200).send('User deleted successfully');
        }).catch((err: Error) => {
            next(err);
        });
    }

    static deleteUserAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = parseInt(req.params.id ?? '');
        if (isNaN(id)) {
            throw new Error(`User '${id}' not found`, 400);
        }
        await UserService.deleteUserFromDb(id).then(() => {
            res.status(200).send('User deleted successfully');
        }).catch((err: Error) => {
            next(err);
        });
    }
}