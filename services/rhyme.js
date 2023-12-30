const { error } = require('express-openapi-validator');
const db = require('../DB/DataAccess');
const op = require('sequelize').Op;
require('dotenv').config();
const OpenAIApi = require("openai");

exports.findAll = async (page = 1, limit = 20, title = '') => {
    try {
        const rhymes = await db.Rhyme.findAll({
            where: {
                title: {
                    [op.like]: `%${title}%`
                }
            },
            limit: limit,
            offset: (page - 1) * limit
        });
        if (!rhymes.length) {
            let err = new Error('No rhyme found');
            err.status = 404;
            throw err;
        }

        return rhymes.map(rhyme => rhyme.dataValues);
    } catch (err) {
        throw err
    }
}

exports.findById = async (id) => {
    try {
        const rhyme = await db.Rhyme.findByPk(id);
        if (!rhyme) {
            let err = new Error('Rhyme not found');
            err.status = 404
            throw err
        }

        return rhyme
    } catch (err) {
        throw err
    }
}

exports.findByParentId = async (parentId, page = 1, limit = 20) => {
    try {
        const rhymes = db.Rhyme.findAll({
            where: {
                parentId: parentId
            },
            limit: limit,
            offset: (page - 1) * limit
        });
        if (!rhymes) {
            let err = new Error('Rhyme not found');
            err.status = 404
            throw err
        }

        return rhymes
    } catch (err) {
        throw err
    }
}

exports.create = async (title, content, userId, parentId = null) => {
    try {
        if (parentId) {
            parent = await db.Rhyme.findByPk(parentId);
            if (!parent) {
                let err = new Error('Parent rhyme not found');
                err.status = 404
                throw err
            }
        }
        //check if user exists
        user = await db.User.findByPk(userId);
        if (!user) {
            let err = new Error('User not found');
            err.status = 404
            throw err
        }

        if (content) {
            const firstLetters = content
                .split("\n")
                .map(element => element.trim().toLowerCase()[0])
                .join('');
            if (firstLetters !== title.toLowerCase()) {
                let err = new Error('Invalid Rhyme: Content does not match title');
                err.status = 400
                throw err
            }
        }

        const rhyme = db.Rhyme.create({
            title: title,
            content: content,
            userId: userId,
            parentId: parentId
        })
        if (!rhyme) {
            let err = new Error('Rhyme not found');
            err.status = 404
            throw err
        }

        return rhyme
    } catch (err) {
        throw err
    }
}

exports.generate = async (title, userId) => {
    //check if user exists
    try {
        user = await db.User.findByPk(userId);
        if (!user) {
            let err = new Error('User not found');
            err.status = 404
            throw err
        }

        //calling chatGPT API
        const openai = new OpenAIApi({
            apiKey: process.env.OPENAI_SECRET_KEY,
        });
        let chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "Tu es un spécialiste en poésie et création d'acrostiche."
                },
                {
                    role: 'user',
                    content: `Crée un seul acrostiche avec le titre: ${title}`
                }
            ],
            max_tokens: 50,
        });
        content = chatCompletion.choices[0].message.content;
        content = content.split('\n')
        content = `${content[0]}\n${content[1]}\n${content[2]}`

        rhyme = db.Rhyme.create({
            title: title,
            content: content,
            userId: userId,
            generated: true
        })

        if (!rhyme) {
            let err = new Error('Rhyme not found');
            err.status = 404
            throw err
        }
    } catch (err) {
        throw err;
    }
}

exports.delete = async (id, userId) => {
    try {
        let rhymeToDelete = await this.findById(id);
        if (!rhymeToDelete) {
            let err = new Error('Rhyme not found')
            err.status = 404
            throw err
        } else {
            if (rhymeToDelete.userId != userId) {
                let err = new Error('Unauthorized')
                err.status = 401
                throw err
            }
        }
        const rhyme = await db.Rhyme.destroy({
            where: {
                id: id
            }
        })

        if (!rhyme) {
            let err = new Error('Internal server error')
            err.status = 500
            throw err
        }

        return rhyme
    } catch (err) {
        throw err
    }
}