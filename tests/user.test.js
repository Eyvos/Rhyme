const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  

const expect = chai.expect;

chai.use(chaiHttp);

describe('User Service', () => {
    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const res = await chai.request(app)
                .get('/users');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should return a specific user by ID', async () => {
            const res = await chai.request(app)
                .get('/users/1');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });

        it('should return a 404 error for a non-existing user ID', async () => {
            const res = await chai.request(app)
                .get('/users/999');

            expect(res).to.have.status(404);
        });
    });

    describe('PUT /users/:id/change-username', () => {
        it('should change the username of a specific user by ID', async () => {
            const res = await chai.request(app)
                .put('/users/1/change-username')
                .send({
                    email: 'user@example.com',
                    username: 'newusername'
                });

            expect(res).to.have.status(200);
        });

        it('should return a 404 error if the user ID does not exist when changing the username', async () => {
            const res = await chai.request(app)
                .put('/users/999/change-username')
                .send({
                    email: 'user@example.com',
                    username: 'newusername'
                });

            expect(res).to.have.status(404);
        });

        it('should return a "Username already used" error if the new username is already in use', async () => {
            const res = await chai.request(app)
                .put('/users/1/change-username')
                .send({
                    email: 'user@example.com',
                    username: 'existingusername'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });
});