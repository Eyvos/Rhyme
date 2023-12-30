const { UniqueConstraintError } = require('sequelize');
let jwt = require('jsonwebtoken');
require('dotenv').config();
const rhymeService = require('../services/rhyme');

exports.getAll = async (req, res, next) => {
    try {
        let rhymes = await rhymeService.findAll(req.query.page, req.query.limit, req.query.title)
        if (!rhymes.length) {
            const err = new Error('No rhyme found')
            err.status = 404
            throw err
        }
        res.status(200).json({
            message: 'Rhymes found',
            page: req.query.page,
            limit: req.query.limit,
            rhymes: rhymes
        });
    } catch (err) {
        next(err)
    }
}

exports.getByParentId = async (req, res, next) => {
    try {
        let rhymes = await rhymeService.findByParentId(req.params.id, req.query.page, req.query.limit)
        if (!rhymes.length) {
            const err = new Error('No rhyme found')
            err.status = 404
            throw err
        }
        res.status(200).json({
            message: 'Rhymes found',
            page: req.query.page,
            limit: req.query.limit,
            rhymes: rhymes
        });
    } catch (err) {
        next(err)
    }
}

exports.getById = async (req, res, next) => {
    try {
        let rhyme = await rhymeService.findById(req.params.id);
        if (!rhyme) {
            const err = new Error('No rhyme found')
            err.status = 404
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

exports.create = async (req, res, next) => {
    try {
        const userId = jwt.decode(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY).id
        if (req.body.userId != userId) {
            const err = new Error('Unauthorized')
            err.status = 401
            throw err
        } else {
            let rhyme = await rhymeService.create(
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

exports.generate = async (req, res, next) => {
    try {
        const userId = jwt.decode(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY).id
        if (req.body.userId != userId) {
            const err = new Error('Unauthorized')
            err.status = 401
            throw err
        } else {
            let rhyme = await rhymeService.generate(
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

exports.delete = async (req, res, next) => {
    try {
        const userId = jwt.decode(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY).id
        let rhyme = await rhymeService.delete(req.params.id, userId);
        res.status(200).json({
            message: 'Rhyme deleted successfully',
            rhyme: rhyme
        });
    } catch (err) {
        next(err)
    }
}
