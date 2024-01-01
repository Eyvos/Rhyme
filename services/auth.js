const db = require('../DB/DataAccess');
const Op = require('sequelize').Op;

exports.login = async (email, hash) => {
    try {
        const user = await db.User.findOne({where: { email: email, password: hash } });
        if (!user) {
            const err = new Error('Invalid email or password');
            err.status = 400;
            throw err
        }
        return user;
    } catch (err) {
        throw err
    }
};

exports.register = (username, email, password) => {
    return new Promise((resolve, reject) => {
      try
      {
        db.User.findAll(
            { where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            } }
        ).then(users => {
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

                throw new Error(error + ' already used');
            } else {
                db.User.create({ username: username, email: email, password: password }).then(user => {
                    resolve(user);
                }).catch(err => {
                    throw err;
                });
            }
        });
    } catch (err) {
        throw err; // Propage l'erreur pour être capturée dans le contrôleur
    };
    });
}