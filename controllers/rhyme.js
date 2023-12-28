const { UniqueConstraintError } = require('sequelize');
let jwt = require('jsonwebtoken');
require('dotenv').config();
const rhymeService = require('../services/rhyme');

exports.getAll = async (req, res) => {
    try {
        let rhymes = await rhymeService.findAll(req.query.page, req.query.limit, req.query.title)
        if (!rhymes.length) {
            throw new Error('No rhyme found')
        }
        res.status(200).json({
            message: 'Rhymes found',
            page: req.query.page,
            limit: req.query.limit,
            rhymes: rhymes
        });
    } catch (err) {
        res.status(404).json({
            message: err.message,
            page: req.query.page,
            limit: req.query.limit,
        });
    }
}

exports.getByParentId = async (req, res) => {
    try {
        let rhymes = await rhymeService.findByParentId(req.params.id, req.query.page, req.query.limit)
        if (!rhymes.length) {
            throw new Error('No rhyme found')
        }
        res.status(200).json({
            message: 'Rhymes found',
            page: req.query.page,
            limit: req.query.limit,
            rhymes: rhymes
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
}

exports.getById = async (req, res) => {
    try {
        let rhyme = await rhymeService.findById(req.params.id);
        console.log("error", rhyme)
        if (!rhyme) {
            res.status(404).json({
                message: 'Rhyme not found'
            });
        }
        res.status(200).json({
            message: 'Rhyme found',
            rhyme: rhyme
        });
    } catch (err) {
        res.status(404).json({
            message: "Rhyme not found"
        });
    }
}

exports.create = async (req, res) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY).id
    if (req.body.userId != userId) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    } else {
        try {
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
        } catch (err) {
            if (err.message === "Parent rhyme not found") {
                res.status(404).json({ message: err.message });
            }
            else {
                if (err.message === "User not found") {
                    res.status(404).json({ message: err.message });
                } else {
                    if (err.message === "Invalid Rhyme: Content does not match title") {
                        res.status(400).json({ message: err.message });
                    } else {
                        res.status(500).send("Internal server error");
                    }
                }
            }
        }
    }
}

exports.delete = async (req, res) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY).id
    try {
        let rhyme = await rhymeService.delete(req.params.id, userId);
        res.status(200).json({
            message: 'Rhyme deleted successfully',
            rhyme: rhyme
        });
    } catch (err) {
        if (err.message === "Unauthorized") {
            res.status(401).json({
                message: err.message
            });
        } else {
            if (err === "Rhyme not found") {
                res.status(404).send({ message: err });
            } else {
                res.json({
                    message: err.message
                })
            }
        }
    }
}
