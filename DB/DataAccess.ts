import { DataTypes, Model, Sequelize } from 'sequelize';
import { IRhyme } from '../models/rhyme';
import { IUser } from '../models/user';
const dotenv = require('dotenv');
dotenv.config();

interface UserModel extends IUser, Model<IUser> {}
interface RhymeModel extends Model<IRhyme>, IRhyme {}


let sequelize: Sequelize;
if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST) 
{
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect:'mysql',
            port: 3306,
        }
    );
}
else{
    throw new Error('Database configuration not found');
}

// interface RhymeInstance extends Sequelize.Instance<IRhyme>, IRhyme {}

//#region define post table
const Rhyme = sequelize.define<RhymeModel>('Rhyme', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    
    }
});
Rhyme.hasMany(Rhyme, { foreignKey: 'parentId', sourceKey: 'id' });
//#endregion

//#region define user table
const User = sequelize.define<UserModel>('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
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

export const db = sequelize;
export const UserTable = User;
export const RhymeTable = Rhyme;