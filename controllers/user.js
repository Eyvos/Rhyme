const userService = require('../services/user');
require('dotenv').config();

//gets parameters from the request body and passes them to the service
// to get all users
exports.getAll = async (req, res) => {
    let limit = req.query.limit ?? 20; // default limit to 20 docs
    let page = req.query.page ?? 1; // default page number is 1
    let username = req.query.username ?? ''; // default is empty string
    await userService.findAll(username, page, limit).then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.log(err);
        res.status(401).json({ message: "Invalid email / password supplied" });
    });
}

exports.getOne = async (req, res) => {
    await userService.findOne(req.params.id).then(user => {
        res.status(200).json(user);
    }).catch(err => {
        console.log(err);
        res.status(401).json({ message: "Invalid email / password supplied" });
    });
}