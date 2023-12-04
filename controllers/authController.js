const authService = require('../services/authService');

exports.login = (req, res) => {
    res.status(202).json({ message: "Hello login" });
}