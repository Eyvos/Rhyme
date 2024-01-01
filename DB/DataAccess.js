const sequelizeModule = require('sequelize');
const CONFIG = require('../config/config.json').Database;

const sequelize = new sequelizeModule.Sequelize(
    CONFIG.Name,
    CONFIG.User,
    CONFIG.Password,
    {
        host: CONFIG.Host,
        dialect: 'mysql',
        port: CONFIG.Port,
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
Rhyme.hasMany(Rhyme, { foreignKey: 'parentId', sourceKey: 'id' });
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
User.hasMany(Rhyme, { foreignKey: 'userId', sourceKey: 'id' });
//#endregion
//#region sync table with database
User.sync();
Rhyme.sync();
//#endregion
exports.User = User;
exports.Rhyme = Rhyme;
exports.DB = sequelize;