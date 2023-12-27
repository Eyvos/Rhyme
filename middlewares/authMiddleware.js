const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_KEY);
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed, invalid token" });
    }
}