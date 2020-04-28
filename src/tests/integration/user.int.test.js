const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const testDatabase = require('../../database/testDatabase');
const TokenHelper = require('../../helpers/token');

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

let thelmaUser, rafaUser, thelmaToken, rafaToken, fakeId, fakeToken; 

// Writing these functions separately because they will be reused
// in many test suites.
const createUsers = async () => {
    thelmaUser = new User({
        name: 'Thelma',
        email: 'thelma@mail.com',
        password: 'winner'
    });
    rafaUser = new User({
        name: 'Rafa',
        email: 'rafa@mail.com',
        password: 'naogostodevoce'
    });
    await thelmaUser.save();
    await rafaUser.save();
    
    fakeId = '5ea84d2a3f42071f796aadc6';

    thelmaToken = TokenHelper.makeUserToken(thelmaUser.id);
    rafaToken = TokenHelper.makeUserToken(rafaUser.id);
    fakeToken = TokenHelper.makeUserToken(fakeId);
};

const removeUsers = async () => {
    thelmaUser = new User({
        name: 'Thelma',
        email: 'thelma@mail.com',
        password: 'winner'
    });
    rafaUser = new User({
        name: 'Rafa',
        email: 'rafa@mail.com',
        password: 'naogostodevoce'
    });
    await thelmaUser.save();
    await rafaUser.save();
    
    fakeId = '5ea84d2a3f42071f796aadc6';

    thelmaToken = TokenHelper.makeUserToken(thelmaUser.id);
    rafaToken = TokenHelper.makeUserToken(rafaUser.id);
    fakeToken = TokenHelper.makeUserToken(fakeId);
};

describe('PUT /api/users/:userId', () => {
    beforeAll(createUsers);
    afterAll(removeUsers);
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put('/api/users/123abc456def789')
            .send({
                name: 'Pyong Lee'
            });
        expect(response.status).toBe(401);
    });
    it('should return 400 if invalid token is provided', async () => {
        const response = await request(app)
            .put('/api/users/123abc456def789')
            .set('auth', 'Not a token')
            .send({
                name: 'Thelma'
            });
        expect(response.status).toBe(400);
    });
    it('should return 403 if token belongs to another user', async () => {
        const response = await request(app)
            .put(`/api/users/${thelmaUser.id}`)
            .set('auth', rafaToken)
            .send({
                name: 'Thelma Campeã'
            });
        expect(response.status).toBe(403);
    });
    it('should return 400 if request body is invalid', async () => {
        const response = await request(app)
            .put(`/api/users/${thelmaUser.id}`)
            .set('auth', thelmaToken)
            .send({
                name: 2020
            });
        expect(response.status).toBe(400);
    });
    it('should return 404 if user is not found', async () => {
        const response = await request(app)
            .put(`/api/users/${fakeId}`)
            .set('auth', fakeToken)
            .send({
                name: 'I am not an user'
            });
        expect(response.status).toBe(404);
    });
    it('should return 200 and update user', async () => {
        const response = await request(app)
            .put(`/api/users/${thelmaUser.id}`)
            .set('auth', thelmaToken)
            .send({
                name: 'Thelma Campeã'
            });

        const newThelma = await User.findById(thelmaUser.id);
        expect(response.status).toBe(200);
        expect(newThelma.name).toBe('Thelma Campeã');
    });
});

describe('DELETE /api/users/:userId', () => {
    beforeAll(createUsers);
    afterAll(removeUsers);
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .delete('/api/users/123abc456def789');
        expect(response.status).toBe(401);
    });
    it('should return 400 if invalid token is provided', async () => {
        const response = await request(app)
            .delete('/api/users/123abc456def789')
            .set('auth', 'Not a token');
        expect(response.status).toBe(400);
    });
    it('should return 403 if token belongs to another user', async () => {
        const response = await request(app)
            .delete(`/api/users/${thelmaUser.id}`)
            .set('auth', rafaToken);
        expect(response.status).toBe(403);
    });
    it('should return 404 if user is not found', async () => {
        const response = await request(app)
            .delete(`/api/users/${fakeId}`)
            .set('auth', fakeToken);
        expect(response.status).toBe(404);
    });
    it('should return 200 and delete user', async () => {
        const response = await request(app)
            .delete(`/api/users/${rafaUser.id}`)
            .set('auth', rafaToken);

        //const dbQuery = await User.findById(rafaUser.id);
        
        //expect(dbQuery).toBe(null);
        expect(response.status).toBe(200);
    });
});

describe('GET /api/users/:userId', () => {
    beforeAll(createUsers);
    afterAll(removeUsers);
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/api/users/123abc456def789');
        expect(response.status).toBe(401);
    });
    it('should return 400 if invalid token is provided', async () => {
        const response = await request(app)
            .get('/api/users/123abc456def789')
            .set('auth', 'Not a token');
        expect(response.status).toBe(400);
    });
    it('should return 403 if token belongs to another user', async () => {
        const response = await request(app)
            .get(`/api/users/${thelmaUser.id}`)
            .set('auth', rafaToken);
        expect(response.status).toBe(403);
    });
    it('should return 404 if user is not found', async () => {
        const response = await request(app)
            .get(`/api/users/${fakeId}`)
            .set('auth', fakeToken);
        expect(response.status).toBe(404);
    });
    it('should return 200 and user', async () => {
        const response = await request(app)
            .get(`/api/users/${thelmaUser.id}`)
            .set('auth', thelmaToken);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(thelmaUser.email);
        expect(response.body.name).toBe(thelmaUser.name);
    });
});