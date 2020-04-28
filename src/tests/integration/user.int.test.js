const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const testDatabase = require('../../database/testDatabase');

beforeAll( async () => {
    await testDatabase.connect();    
});

afterAll( async () => {
    await testDatabase.clearDatabase();
    await testDatabase.closeDatabase();
});

let endpoint, user; 

describe('POST /api/users', () => {
    beforeAll( async () => {
        endpoint = '/api/users';
        user = new User({
            name: 'Charlie Kaufman',
            email: 'charliek@mail.com',
            password: 'weirddreams'
        });
        await user.save();
    });
    afterAll( async () => {
        await user.remove();
    });
    it('should return 409 if email is already in use', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                name: 'Charlie Kaufman',
                email: 'charliek@mail.com',
                password: 'weirddreams'
            });
        expect(response.status).toBe(409);
    });
    it('should return 400 on invalid request', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'charliechaplin@mail.com',
                password: 'moderntimes'
        });
        expect(response.status).toBe(400);
    });
    it('should return 201 when user is created and user without password', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: 'katewinslet@mail.com',
                name: 'Kate Winslet',
                password: 'clementine'
            });
        expect(response.status).toBe(201);
        expect(response.body.name).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.password).toBeFalsy();
    });
});