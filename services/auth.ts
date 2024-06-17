import { UserTable } from '../DB/DataAccess';
import { Error } from '../models/error';
import { IUser } from '../models/user';
import { Op } from 'sequelize';

export class AuthService{
    static login = async (email: string, hash: string): Promise<IUser> => {
        try {
            const user = await UserTable.findOne({where: { email: email, password: hash } });
            if (!user) {
                const err = new Error('Invalid email or password', 400);
                throw err
            }
            return user;
        } catch (err) {
            throw err
        }
    }

    static register = async (username: string, email: string, password: string): Promise<IUser> => {
        try {
            const users = await UserTable.findAll({ where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            } });
            if (users.length > 0) {
                let error = '';
                if(users.find( user => user.username === username))
                    error += 'Username';

                if(users.find( user => user.email === email))
                {
                    if(error.length > 0)
                        error += ' and email';
                    else
                        error += 'Email';
                }

                throw new Error(error + ' already used', 403);
            } else {
                const user = await UserTable.create(
                    { 
                        username: username, 
                        email: email, 
                        password: password,
                        isAdmin: false
                    });
                return user;
            }
        } catch (err) {
            throw err
        }
    }
}