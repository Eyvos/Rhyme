const userService = require('../services/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        res.status(401).json({ message: "User '" + req.params.id + "' not found" });
    });
}

exports.changeUsername = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userDecoded = jwt.verify(token, process.env.TOKEN_KEY);
    await userService.changeUsername(userDecoded.id, userDecoded.email, req.body.username).then(() => {
        res.status(200).send('Username changed successfully');
    }).catch(err => {
        res.status(401).send(err);
    });
}

exports.changePassword = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userDecoded = jwt.verify(token, process.env.TOKEN_KEY);
    const newHash = bcrypt.hashSync(req.body.password, process.env.SALT);
    await userService.changePassword(userDecoded.id, userDecoded.email, newHash).then(() => {
        res.status(200).send('Password changed successfully');
    }).catch(err => {
        res.status(401).send(err);
    });
}

exports.deleteUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userDecoded = jwt.verify(token, process.env.TOKEN_KEY);
    await userService.deleteUserFromDb(userDecoded.id).then(() => {
        res.status(200).send('User deleted successfully')
    }).catch(err => {
        res.status(401).send(err);
    });
}

exports.deleteUserAdmin = async (req, res) => {
    const id = req.params.id;
    await userService.deleteUserFromDb(id).then(() => {
        res.status(200).send('User deleted successfully')
    }).catch(err => {
        res.status(401).send(err);
    });
}