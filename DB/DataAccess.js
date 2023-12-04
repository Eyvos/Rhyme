const sequelizeModule = require('sequelize');

const sequelize = new sequelizeModule.Sequelize(
    'rhymedb',
    'Rhyme',
    '89qFd4!mWy6Uyk^@MWWC',
    {
        host: '127.0.0.1',
        dialect: 'mysql',
    }
);

//#region define post table
const Rhyme = sequelize.define('rhyme', {
    title: {
        type: sequelizeModule.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: sequelizeModule.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelizeModule.DataTypes.INTEGER,
        allowNull: false
    },
    parentId: {
        type: sequelizeModule.DataTypes.INTEGER,
        allowNull: true
    }
});
Rhyme.hasMany(Rhyme, {foreignKey: 'parentId', sourceKey: 'id'});
//#endregion
//#region define user table
const User = sequelize.define('user', {
    email: {
        type: sequelizeModule.DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: sequelizeModule.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelizeModule.DataTypes.STRING,
        allowNull: false
    }
});
User.hasMany(Rhyme, {foreignKey: 'userId', sourceKey: 'id'});
//#endregion
//#region sync table with database
User.sync();
Rhyme.sync();
//#endregion
exports.User = User;
exports.Post = Rhyme;
exports.DB = sequelize;