const request = require('supertest');
const app = require('../../app');
const testDatabase = require('../../database/testDatabase');
const factory = require('./factory');

let endpoint;

afterAll(() => {
    testDatabase.closeDatabase();
})

describe('POST /api/account/recover', () => {
    beforeAll(() => {
        endpoint = '/api/account/recover';
    });
    afterAll(() => {
        testDatabase.clearDatabase();
    });
});
describe('POST /api/account/recover', () => {
    beforeAll(() => {
        endpoint = '/api/account/recover';
    });
    afterAll(() => {
        testDatabase.clearDatabase();
    });
    it('should return 400 on invalid requests', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({ email: 'Tiago Leifert' });
        expect(response.status).toBe(400);
    });
    it('should return 404 if user is not found', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({ email: 'tiagoleifert@globo.com' });
        expect(response.status).toBe(404);
    });
    /*it('should return 200 and change user\'s password', async () => {
        let user = await factory.create('User');
        const oldPassword = user.password; 

        const response = await request(app)
            .post(endpoint)
            .send({ email: user.email });
        
        //const passwordChanged = oldPassword !== user.password; 

        expect(response.status).toBe(200);
        //expect(passwordChanged).toBe(true);
    });*/
});