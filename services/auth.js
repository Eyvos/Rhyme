const db = require('../DB/DataAccess');
const Op = require('sequelize').Op;

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        db.User.findAll({
            where: {
                email: email,
                password: password
            }
        }).then(users => {
            if (users.length > 0) {
                resolve(users[0].dataValues);
            } else {
                reject('Invalid email or password');
            }
        }).catch(err => {
            reject(err);
        });
    });
};

exports.register = (username, email, password) => {
    return new Promise((resolve, reject) => {
        db.User.findAll(
            { where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            } }
        ).then(users => {
            if (users.length > 0) {
                let error = '';
                if(users.find( user => user.username === username))
                    error += 'Username';

                if(users.find( user => user.email === email))
                {
                    if(error.length > 0)
                        error += ' and email';
                    else
                        error += 'Email';
                }

                reject(error + ' already used');
            } else {
                db.User.create({ username: username, email: email, password: password }).then(user => {
                    resolve(user);
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        });
    });
}