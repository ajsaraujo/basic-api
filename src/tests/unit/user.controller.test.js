const httpMocks = require('node-mocks-http');

const UserController = require('../../controllers/UserController');
const User = require('../../models/User');


let req, res, next; 

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    process.env.JWT_SECRET = 'segredo';
    process.env.JWT_EXPIRE_TIME = '7d';
});

jest.mock('../../models/User');

const newUser = {
    name: 'John Q Public',
    email: 'johnq@public.com',
    password: 'johnqpublic',
    id: '45878e7erw78a8'
}

const updatingUser = {
    name: 'John Queue Public',
    password: 'johnqueuepublic', 
    id: '5e99b5a66b38ec5329f750af'
};

describe('UserController.createUser', () => {
    beforeEach(() => { 
        req.body = newUser; 
        req.emailInUse = false;
    });
    it('should have a createUser function', () => {
        expect(typeof UserController.createUser).toBe('function');
    });
    it('should call User.create', async () => {
        User.create.mockReturnValue(newUser);
        await UserController.createUser(req, res);
        expect(User.create).toBeCalledWith(newUser);
    });
    it('should return 400 on request body with missing entries', async () => {
        delete req.body.email;
        await UserController.createUser(req, res); 
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 on request body with invalid entries (1)', async () => {
        req.body.email = 'I\'m not an email';
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(400);
        req.body.email = 'johnq@public.com';
    });
    it('should return 400 on request body with invalid entries (2)', async () => {
        req.body.name = 41; // Not the answer!
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(400);
        req.body.name = 'John Q Public';
    })
    it('should return 409 if email is already in use', async () => {
        req.emailInUse = true;
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(409);
    });
    it('should return 201 and user', async () => {
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newUser);
    });
});

describe('UserController.updateUser', () => {
    beforeEach(() => {
        req.body = updatingUser;
    });
    it('should return 400 on request body with email', async () => {
        req.body = newUser;
        await UserController.updateUser(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 on request body with invalid entries (1)', async () => {
        req.body.name = 'name_lastname';
        await UserController.updateUser(req, res);
        expect(res.statusCode).toBe(400);
        req.body.name = 'John Queue Public';
    });
    it('should return 400 on request body with invalid entries (2)', async () => {
        req.body.name = 41; // Still not the answer
        await UserController.updateUser(req, res);
        expect(res.statusCode).toBe(400);
        req.body.name = 'John Queue Public';
    });
    
});