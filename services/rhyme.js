const { error } = require('express-openapi-validator');
const db = require('../DB/DataAccess');
const op = require('sequelize').Op;

exports.findAll = (page = 1, limit = 20, title = '') => {
    return new Promise((resolve, reject) => {
        db.Rhyme.findAll({
            where: {
                title: {
                    [op.like]: `%${title}%`
                }
            },
            limit: limit,
            offset: (page - 1) * limit
        }).then(rhymes => {
            resolve(rhymes.map(rhyme => rhyme.dataValues));
        }).catch(err => {
            reject(err);
        });
    });
}

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        db.Rhyme.findByPk(id).then(rhyme => {
            if (rhyme != null)
                resolve(rhyme.dataValues);
            else {
                reject('Rhyme not found');
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.findByParentId = (parentId, page = 1, limit = 20) => {
    return new Promise((resolve, reject) => {
        db.Rhyme.findAll({
            where: {
                parentId: parentId
            },
            limit: limit,
            offset: (page - 1) * limit
        }).then(rhymes => {
            resolve(rhymes.map(rhyme => rhyme.dataValues));
        }
        ).catch(err => {
            reject(err);
        });
    });
}

exports.create = async (title, content, userId, parentId = null) => {
    //check if parent rhyme exists
    if (parentId) {
        parent = await db.Rhyme.findByPk(parentId);
        if (!parent) {
            throw new Error('Parent rhyme not found');
        }
    }
    //check if user exists
    user = await db.User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (content) {
        const firstLetters = content
            .split("\n")
            .map(element => element.trim().toLowerCase()[0])
            .join('');
        if (firstLetters !== title.toLowerCase()) {
            throw new Error('Invalid Rhyme: Content does not match title');
        }
    }
    return new Promise((resolve, reject) => {
        db.Rhyme.create({
            title: title,
            content: content,
            userId: userId,
            parentId: parentId
        }).then(rhyme => {
            resolve(rhyme);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.delete = async (id, userId) => {
    let rhymeToDelete = await this.findById(id);
    if (!rhymeToDelete) {
        throw new Error('Rhyme not found')
    } else {
        if (rhymeToDelete.userId != userId) {
            throw new Error('Unauthorized')
        }
    }
    return new Promise((resolve, reject) => {
        db.Rhyme.destroy({
            where: {
                id: id
            }
        }).then(
            resolve(rhymeToDelete)
        ).catch(err => {
            reject(err);
        });
    });
}