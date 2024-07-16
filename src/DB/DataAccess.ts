import { DataTypes, Model, Sequelize } from 'sequelize';
import { IRhyme } from '../models/rhyme';
import { IUser } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

interface UserModel extends IUser, Model<IUser> { }
interface RhymeModel extends Model<IRhyme>, IRhyme { }

let sequelize: Sequelize;

if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST) {
    sequelize = new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false, // Désactivez le logging pour éviter les informations inutiles en production
    });
} else {
    throw new Error('Database configuration not found');
}

// Définir le modèle Rhyme
const Rhyme = sequelize.define<RhymeModel>('Rhyme', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

// Définir la relation Rhyme
Rhyme.hasMany(Rhyme, { foreignKey: 'parentId', sourceKey: 'id' });

// Définir le modèle User
const User = sequelize.define<UserModel>('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ajout d'une contrainte d'unicité pour l'email
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ajout d'une contrainte d'unicité pour le nom d'utilisateur
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    defaultScope: {
        attributes: { exclude: ['password', 'isAdmin'] },
    },
});

// Définir la relation User -> Rhyme
User.hasMany(Rhyme, { foreignKey: 'userId', sourceKey: 'id' });

const UserFollows = sequelize.define('UserFollows', {})
UserFollows.hasMany(User, { foreignKey: 'userId', sourceKey: 'id' });
UserFollows.hasMany(User, { foreignKey: 'followerId', sourceKey: 'id' });

// Synchroniser les modèles avec la base de données
sequelize.sync({ alter: true }) // Utiliser alter pour mettre à jour les tables existantes sans les recréer
    .then(() => console.log('Database & tables created!'))
    .catch((error) => console.error('Error creating database & tables:', error));

export const db = sequelize;
export const UserTable = User;
export const RhymeTable = Rhyme;
export const UserFollowsTable = UserFollows;
