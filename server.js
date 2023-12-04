const sequelizeModule = require('sequelize');

const sequelize = new sequelizeModule.Sequelize('localhost:3306', 'rhyme', '89qFd4!mWy6Uyk^@MWWC');
const User = sequelize.define('user', {
    email: {
        type: sequelizeModule.STRING,
        allowNull: false
    },
    username: {
        type: sequelizeModule.STRING,
        allowNull: false
    },
    password: {
        type: sequelizeModule.STRING,
        allowNull: false
    }
});