const sequelizeModule = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();

const sequelize = new sequelizeModule.Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
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
    },
    isAdmin: {
        type: sequelizeModule.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    defaultScope: {
        attributes: { exclude: ['password', 'isAdmin'] },
    },
});
User.hasMany(Rhyme, { foreignKey: 'userId', sourceKey: 'id' });
//#endregion
//#region sync table with database
Rhyme.sync();
User.sync();
//#endregion
exports.User = User;
exports.Rhyme = Rhyme;
exports.DB = sequelize;