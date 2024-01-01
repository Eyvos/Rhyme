const jwt = require('jsonwebtoken');
const dbUser = require('../DB/DataAccess').User;
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_KEY);
        const user = jwt.decode(token, process.env.TOKEN_KEY);
        const isUserAdmin = (await dbUser.findOne({ where: { id: user.id, isAdmin: true } })) != null;
        if (!isUserAdmin)
            throw new Error('This route is only for admin users');
        

        next();
    } catch (error) {
        res.status(401).json({ message: "This route is only for admin users" });
    }
}