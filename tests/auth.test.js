const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth Service', () => {
    describe('POST /login', () => {
        it('should login a user with valid credentials', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    email: 'user@example.com',
                    password: 'userpassword'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user');
        });

        it('should return an error with invalid credentials', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    email: 'nonexistentuser@example.com',
                    password: 'invalidpassword'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });

    describe('POST /register', () => {
        it('should register a new user with unique username and email', async () => {
            const res = await chai.request(app)
                .post('/register')
                .send({
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'newuserpassword'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user');
        });

        it('should return an error if username or email is already in use', async () => {
            const res = await chai.request(app)
                .post('/register')
                .send({
                    username: 'existinguser',
                    email: 'existinguser@example.com',
                    password: 'existinguserpassword'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });
});