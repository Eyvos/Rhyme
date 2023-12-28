let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const authService = require('../services/auth');


exports.login = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
    await authService.login(req.body.email, hash).then(user => {
        let token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    }).catch(err => {
        console.log(err);
        res.status(400).json({ message: "Invalid email / password supplied" });
    });

}

exports.register = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, process.env.SALT);
    authService.register(req.body.username, req.body.email, hash).then(user => {
        res.status(200).json({
            message: 'User created successfully',
            user: user
        });
    }).catch(err => {
        if (err.statusCode === 400) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).send("Internal server error");
        }
    });
}