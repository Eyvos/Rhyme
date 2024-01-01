let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const authService = require('../services/auth');

exports.login = async (req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
        const user = await authService.login(req.body.email, hash);
        delete user.dataValues.password;
        let token = jwt.sign(user.dataValues, process.env.TOKEN_KEY, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    } catch (err) {
        next(err)
    };
}

exports.register = async (req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
        const user = await authService.register(req.body.username, req.body.email, hash);

        res.status(200).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        next(err); // Passe l'erreur au middleware d'erreur global
    }
};