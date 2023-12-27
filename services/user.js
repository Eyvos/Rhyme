const db = require('../DB/DataAccess');
const Op = require('sequelize').Op;
// retrieve all users which match the given username
// for a limited number of documents
exports.findAll = async (username = '', page = 1, limit = 20) => {
    return new Promise((resolve, reject) => {
        db.User.findAll({
            where: {
                username: {
                    [Op.like]: '%' + username + '%'
                }
            },
            offset: (page - 1) * limit,
            limit: limit
        }).then(users => {
            users.map(user => {
                delete user.dataValues.password;
            })
            resolve(users);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.findOne = async (id) => {
    return new Promise((resolve, reject) => {
        db.User.findByPk(id).then(user => {
            delete user.dataValues.password;
            resolve(user);
        }).catch(err => {
            reject(err);
        });
    });
}