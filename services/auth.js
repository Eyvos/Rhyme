const db = require('../DB/DataAccess');

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
        db.User.findAll({
            where: {
                email: email,
                username: username
            }
        }).then(users => {
            if (users.length > 0) {
                let err = new Error('Email or username already exists');
                err.statusCode = 400;
                reject(err);
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