const db = require('../DB/DataAccess');
const bcrypt = require('bcrypt');

exports.login = (email, hash) => {
    try {
        const rhyme = db.User.findOne({ where: { email: email } });
        if (!user) {
            const err = new Error('Invalid email or password');
            err.status = 400;
            throw err
        }
        const isValidPassword = hash == user.password;
        if (!isValidPassword) {
            const err = new Error('Invalid email or password');
            err.status = 400;
            throw err
        }
    } catch (err) {
        throw err
    }
};

exports.register = async (username, email, password) => {
    try {
        const existingUser = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            let err = new Error('Email or username already exists');
            err.statusCode = 400;
            throw err;
        }

        const user = await db.User.create({ username: username, email: email, password: password });
        return user;
    } catch (err) {
        throw err; // Propage l'erreur pour être capturée dans le contrôleur
    }
};