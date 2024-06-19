const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Rhyme Service', () => {
    describe('GET /rhymes', () => {
        it('should return a list of rhymes', async () => {
            const res = await chai.request(app)
                .get('/rhymes');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should return a specific rhyme by ID', async () => {
            const res = await chai.request(app)
                .get('/rhymes/1');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });

        it('should return a 404 error for a non-existing rhyme ID', async () => {
            const res = await chai.request(app)
                .get('/rhymes/999');

            expect(res).to.have.status(404);
        });
    });

    describe('POST /rhymes', () => {
        it('should create a new rhyme', async () => {
            const res = await chai.request(app)
                .post('/rhymes')
                .send({
                    title: 'New Rhyme',
                    content: 'This is a new rhyme content',
                    userId: 1
                });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });

        it('should return a 404 error if user does not exist when creating a rhyme', async () => {
            const res = await chai.request(app)
                .post('/rhymes')
                .send({
                    title: 'New Rhyme',
                    content: 'This is a new rhyme content',
                    userId: 999
                });

            expect(res).to.have.status(404);
        });

    });

    describe('DELETE /rhymes/:id', () => {
        it('should delete a specific rhyme by ID', async () => {
            const res = await chai.request(app)
                .delete('/rhymes/1')
                .send({
                    userId: 1
                });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });

        it('should return a 404 error for a non-existing rhyme ID when deleting', async () => {
            const res = await chai.request(app)
                .delete('/rhymes/999')
                .send({
                    userId: 1
                });

            expect(res).to.have.status(404);
        });

        it('should return a 401 error if the user is not authorized to delete the rhyme', async () => {
            const res = await chai.request(app)
                .delete('/rhymes/1')
                .send({
                    userId: 999
                });

            expect(res).to.have.status(401);
        });
    });
});