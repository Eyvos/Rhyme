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

exports.changeUsername = async (id, email, username) => {
    return new Promise((resolve, reject) => {
        db.User.findOne({
            where: {
                username: username
            }
        }).then(user => {
            if (user) {
                reject('Username already used');
            } else {
                db.User.update({username: username}, {
                    where: {
                        email: email,
                        id: id
                    }
                }).then(columnsAffected => {
                    if(columnsAffected[0] == 0)
                        reject('Id ' + id + ' doesn\'t exist in database');
                    else
                        resolve();
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        });
    });
}


exports.changePassword = async (id, email, newPassword) => {
    return new Promise((resolve, reject) => {
        db.User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user) {
                reject('Username already used');
            } else {
                db.User.update({password: newPassword}, {
                    where: {
                        email: email,
                        id: id
                    }
                }).then(columnsAffected => {
                    if (columnsAffected[0] == 0)
                        reject('Id ' + id + ' doesn\'t exist in database');
                    else
                        resolve();
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.deleteUserFromDb = async (userId) => {
    return new Promise((resolve, reject) => {
        db.User.destroy({
            where: {
                id: userId
            }
        }).then(columnsAffected => {
            if (columnsAffected == 0)
                reject('Id ' + userId + ' doesn\'t exist in database');
            else
                resolve();
        }).catch(err => {
            reject(err);
        });
    });
}