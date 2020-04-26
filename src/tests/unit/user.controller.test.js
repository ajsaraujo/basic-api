const httpMocks = require('node-mocks-http');

const UserController = require('../../controllers/UserController');
const ValidationHelper = require('../../helpers/validation');
const User = require('../../models/User');

let req, res, next; 

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    //process.env.JWT_SECRET = 'mysecret';
    //process.env.JWT_EXPIRE_TIME = '7d';
});

jest.mock('../../helpers/validation');
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

const goneUser = {
    name: 'Mr Deceased',
    password: 'hesdead',
    id: '5e99b5f98s38ec5329f750af'
}

const userDoc = new User(newUser);

describe('UserController.getUserData', () => {
    beforeEach(() => {
        req.params.userId = '5e99b5f98s38ec5329f750af';
    });
    it('should have a listUsers function', () => {
        expect(typeof UserController.getUserData).toBe('function');
    });
    it('should call Users.findById', async () => {
        await UserController.getUserData(req, res);
        expect(User.findById).toBeCalledWith(req.params.userId);
    });
    it('should return 404 if user doesn\'t exist', async () => {
        User.findById.mockReturnValue(undefined);
        await UserController.getUserData(req, res);
        expect(res.statusCode).toBe(404);
    });
    it('should return 200 and user data', async () => {
        User.findById.mockReturnValue(newUser);
        await UserController.getUserData(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newUser);
    });
})
describe('UserController.createUser', () => {
    beforeEach(() => {
        // Assignment by copy 
        req.body = {};
        for (let key in newUser) {
            req.body[key] = newUser[key];
        }

        req.emailInUse = false;
        ValidationHelper.validateUser.mockReturnValue(true);
    });
    it('should have a createUser function', () => {
        expect(typeof UserController.createUser).toBe('function');
    });
    it('should call User.create', async () => {
        await UserController.createUser(req, res);
        expect(User.create).toBeCalledWith(newUser);
    });
    it('should return 400 to requests with invalid body', async () => {
        ValidationHelper.validateUser.mockReturnValue(false);
        await UserController.createUser(req, res);
        expect(res.statusCode).toBe(400);
    });
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
        ValidationHelper.validateUser.mockReturnValue(true);
    });
    it('should have an updateUser function', () => {
        expect(typeof UserController.updateUser).toBe('function');
    });
    it('should call User.findById', async () => {
        User.findById.mockReturnValue(userDoc);
        await UserController.updateUser(req, res);
        expect(User.findById).toBeCalledWith(req.params.userId);
    });
    it('should return 400 on request body with invalid entries', async () => {
        ValidationHelper.validateUser.mockReturnValue(false);
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

describe('UserController.deleteUser', () => {
    beforeEach(() => {
        req.params.userId = '5e99b5a66b38ec5329f750af';
    });
    it('should have a UserController.deleteUser function', () => {
        expect(typeof UserController.deleteUser).toBe('function');
    });
    it('should call User.findByIdAndDelete', async () => {
        await UserController.deleteUser(req, res);
        expect(User.findByIdAndDelete).toBeCalledWith(req.params.userId);
    });
    it('should return 404 if user doesn\'t exist', async () => {
        User.findByIdAndDelete.mockReturnValue(undefined);
        await UserController.deleteUser(req, res);
        expect(res.statusCode).toBe(404);
    });
    it('should delete user', async () => {
        User.findByIdAndDelete.mockReturnValue(goneUser);
        await UserController.deleteUser(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(goneUser);
    });
});