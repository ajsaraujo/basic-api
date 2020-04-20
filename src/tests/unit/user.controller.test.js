const httpMocks = require('node-mocks-http');

const UserController = require('../../controllers/UserController');
const User = require('../../models/User');

let req, res, next; 

require('dotenv').config();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

jest.mock('../../models/User');
User.prototype.save = jest.fn();

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

const userDoc = new User(newUser);

describe('UserController.createUser', () => {
    beforeEach(() => {
        // Assignment by copy 
        req.body = {};
        for (let key in newUser) {
            req.body[key] = newUser[key];
        }

        req.emailInUse = false;
    });
    it('should have a createUser function', () => {
        expect(typeof UserController.createUser).toBe('function');
    });
    it('should call User.create', async () => {
        await UserController.createUser(req, res);
        expect(User.create).toBeCalledWith(newUser);
    });
    it('should return 400 on request body with missing entries', async () => {
        delete req.body.email;
        await UserController.createUser(req, res); 
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 on request body with invalid entries (1)', async () => {
        req.body.email = 'This is not an email';
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 on request body with invalid entries (2)', async () => {
        req.body.name = 41; // Not the answer!
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(400);
    })
    it('should return 409 if email is already in use', async () => {
        req.emailInUse = true;
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(409);
    });
    it('should return 201 and user', async () => {
        User.create.mockReturnValue(newUser);
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newUser);
    });
});

describe('UserController.updateUser', () => {
    beforeEach(() => {
        req.body = {};
        for (let key in updatingUser) {
            req.body[key] = updatingUser[key];
        };
        req.params.userId = '5e99b5a66b38ec5329f750af';
    });
    it('should have an updateUser function', () => {
        expect(typeof UserController.updateUser).toBe('function');
    });
    it('should call User.findById', async () => {
        await UserController.updateUser(req, res);
        expect(User.findById).toBeCalledWith(req.params.userId);
    });
    it('should return 400 on request body with invalid entries (1)', async () => {
        req.body.name = 'peter_pan';
        await UserController.updateUser(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 on request body with invalid entries (2)', async () => {
        req.body.name = 41; // Still not the answer
        await UserController.updateUser(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 200 and user', async () => {
        // This could be better
        User.findById.mockReturnValue(userDoc);
        User.prototype.save.mockReturnValue(updatingUser);
        await UserController.updateUser(req, res);
        expect(res._getJSONData()).toStrictEqual(updatingUser);
        expect(res._isEndCalled()).toBeTruthy();
    });
    
});