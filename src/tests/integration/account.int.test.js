const request = require('supertest');
const app = require('../../app');

const factory = require('./factory');
const User = require('../../models/User');
const testDatabase = require('../../database/testDatabase');

let endpoint;

beforeAll( async () => {
    await testDatabase.connect();
});

afterAll( async () => {
    await testDatabase.clearDatabase();
    await testDatabase.closeDatabase();
});

let user; 

describe('POST /api/account/auth', () => {
    beforeAll(async () => {
        endpoint = '/api/account/auth';
        user = new User({
            name: 'Joel Barish',
            email: 'joel@mail.com',
            password: 'clementine'
        });
        await user.save();        
    });
    afterAll(async () => {
        await user.remove();
    });
    it('should return 400 on invalid request body', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'Joel Barish',
            });
        expect(response.status).toBe(400);
    });
    it('should return 404 if user is not found', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'joel@gmail.com',
                password: 'clementine'
            });
        expect(response.status).toBe(404);
    });
    it('should return 409 if password is wrong', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'joel@mail.com',
                password: 'naomi'
            });
        expect(response.status).toBe(409);
    });
    it('should return 200 and data if everything is ok', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'joel@mail.com',
                password: 'clementine'
            });
        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe('joel@mail.com');
        expect(response.body.token).toBeTruthy();
    });
});
describe('POST /api/account/recover', () => {
    beforeAll(() => {
        endpoint = '/api/account/recover';
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
    it('should return 200 and change user\'s password', async () => {
        let user = await factory.create('User');
        const oldPassword = user.password; 

        const response = await request(app)
            .post(endpoint)
            .send({ email: user.email });
        
        const updatedUser = User.findOne({ email: user.email });
        const newPassword = updatedUser.password;
        const passwordChanged = oldPassword !== newPassword; 

        expect(response.status).toBe(200);
        expect(passwordChanged).toBe(true);

        //user.remove();
    });
});