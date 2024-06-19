import { NextFunction, Request, Response } from 'express';
import { RhymeService } from '../services/rhyme';
import  { Error } from '../models/error';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../models/user';
dotenv.config();


export class RhymeController{
    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let page = req.query.page ? parseInt(req.query.page as string) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            let title = req.query.title ? req.query.title as string : '';
            let rhymes = await RhymeService.findAll(page, limit, title)
            if (!rhymes.length) {
                const err = new Error('No rhyme found', 404)
                throw err
            }
            res.status(200).json({
                message: 'Rhymes found',
                page: page,
                limit: limit,
                rhymes: rhymes
            });
        } catch (err) {
            next(err)
        }
    }

    static getByParentId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = parseInt(req.params.id ?? '');
            if (isNaN(id)) {
                const err = new Error('Invalid id', 400)
                throw err
            }
            let page = req.query.page ? parseInt(req.query.page as string) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            let rhymes = await RhymeService.findByParentId(id, page, limit)
            if (!rhymes.length) {
                const err = new Error('No rhyme found', 404)
                throw err
            }
            res.status(200).json({
                message: 'Rhymes found',
                page: page,
                limit: limit,
                rhymes: rhymes
            });
        } catch (err) {
            next(err)
        }
    }

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = parseInt(req.params.id ?? '');
            if (isNaN(id)) {
                const err = new Error('Invalid id', 400)
                throw err
            }
            let rhyme = await RhymeService.findById(id);
            if (!rhyme) {
                const err = new Error('No rhyme found', 404)
                throw err
            }
            res.status(200).json({
                message: 'Rhyme found',
                rhyme: rhyme
            });
        } catch (err) {
            next(err)
        }
    }

    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization?.split(' ')[1] ?? '';
            const user = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
            if (req.body.userId != user.id) {
                const err = new Error('Unauthorized', 401)
                throw err
            } else {
                let rhyme = await RhymeService.create(
                    req.body.title,
                    req.body.content,
                    req.body.userId,
                    req.body.parentId
                );
                res.status(200).json({
                    message: 'Rhyme created successfully',
                    rhyme: rhyme
                });
            }
        } catch (err) {
            next(err)
        }
    }

    static generate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization?.split(' ')[1] ?? '';
            const user = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
            if (req.body.userId != user.id) {
                const err = new Error('Unauthorized', 401)
                throw err
            } else {
                let rhyme = await RhymeService.generate(
                    req.body.title,
                    req.body.userId,
                );
                res.status(200).json({
                    message: 'Rhyme generated successfully',
                    rhyme: rhyme
                });
            }
        } catch (err) {
            next(err)
        }
    }
    
        static delete = async (req: Request, res: Response, next: NextFunction) => {
            try {
                let id = parseInt(req.params.id ?? '');
                if (isNaN(id)) {
                    const err = new Error('Invalid id', 400)
                    throw err
                }
                let token = req.headers.authorization?.split(' ')[1] ?? '';
                const user = jwt.verify(token, process.env.TOKEN_KEY ?? '') as IUser;
                    let rhyme = await RhymeService.delete(id,  user.id ?? -1);
                res.status(200).json({
                    message: 'Rhyme deleted successfully',
                    rhyme: rhyme
                });
            } catch (err) {
                next(err)
            }
        }
}