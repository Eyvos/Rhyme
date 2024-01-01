const jwt = require('jsonwebtoken');
const dbUser = require('../DB/DataAccess').User;
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_KEY);
        const user = jwt.decode(token, process.env.TOKEN_KEY);
        const isUserExist = (await dbUser.findOne({ where: { id: user.id } })) != null;
        if (!isUserExist)
            throw new Error('Invalid token');
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Authenticated route, identify yourself with a valid JWT." });
    }
}