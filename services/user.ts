import { UserTable } from '../DB/DataAccess';
import { Op } from 'sequelize';
import { IUser } from '../models/user';

export class UserService {
    static findAll = async (username = '', page = 1, limit = 20): Promise<IUser[]> => {
        return new Promise((resolve, reject) => {
            UserTable.findAll({
                where: {
                    username: {
                        [Op.like]: '%' + username + '%'
                    }
                },
                offset: (page - 1) * limit,
                limit: limit
            }).then(users => {
                users.map(user => {
                   user.dataValues.password = '';
                })
                resolve(users);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static findOne = async (id: number): Promise<IUser> => {
        return new Promise((resolve, reject) => {
            UserTable.findByPk(id).then(user => {
                if (!user)
                    reject('Id ' + id + ' doesn\'t exist in database');
                else
                {
                    user.dataValues.password = '';
                    resolve(user.dataValues);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    static changeUsername = async (id: number, email: string, username: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            UserTable.findOne({
                where: {
                    username: username
                }
            }).then(user => {
                if (user) {
                    reject('Username already used');
                } else {
                    UserTable.update({username: username}, {
                        where: {
                            email: email,
                            id: id
                        }
                    }).then(columnsAffected => {
                        if(columnsAffected[0] == 0)
                            reject('Id ' + id + ' doesn\'t exist in database');
                        else
                            resolve();
                    }).catch(err => {
                        reject(err);
                    });
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
    
    static changePassword = async (id: number, email: string, newPassword: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            UserTable.update({password: newPassword}, {
                where: {
                    email: email,
                    id: id
                }
            }).then(columnsAffected => {
                if (columnsAffected[0] == 0)
                    reject('Id ' + id + ' doesn\'t exist in database');
                else
                    resolve();
            }).catch(err => {
                reject(err);
            });
                
            
        });
    }

    static deleteUserFromDb = async (userId: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            UserTable.destroy({
                where: {
                    id: userId
                }
            }).then(columnsAffected => {
                if (columnsAffected == 0)
                    reject('Id ' + userId + ' doesn\'t exist in database');
                else
                    resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}