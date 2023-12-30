let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const authService = require('../services/auth');


exports.login = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
    await authService.login(req.body.email, hash).then(user => {
        delete user.dataValues.password;
        let token = jwt.sign(user, process.env.TOKEN_KEY);
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    }).catch(err => {
        console.log(err);
        res.status(401).json({ message: "Invalid email / password supplied" });
    });

}

exports.register = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
    await authService.register(req.body.username, req.body.email, hash).then(user => {
        res.status(200).json({
            message: 'User created successfully',
            user: user
        });
    }).catch(err => {
        res.status(401).send(err);
    });
}