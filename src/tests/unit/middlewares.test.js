require('dotenv').config();

const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const emailInUse = require('../../middlewares/emailInUse');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

let req, res, next; 

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('auth', () => {
    beforeEach(() => {
        req.headers.auth = 'some_token';
        req.params.userId = 'rgfh4hs6hfh54sg46';
    });
    it('should return 401 to requests without a token', async () => {
        req.headers.auth = undefined;
        await auth(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it('should return 400 to requests with invalid tokens', async () => {
        req.headers.auth = 'not a valid token';
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });
        await auth(req, res, next);
        expect(res.statusCode).toBe(400);        
    });
    it('should call next when everything is ok', async () => {
        req.headers.auth = 'reittiwerpirwr786deg6s';
        jwt.verify.mockReturnValue({ id: 'rgfh4hs6hfh54sg46'});
        await auth(req, res, next);
        expect(next).toBeCalled();
    });
});

describe('email in use', () => {
    beforeEach(() => {
        req.body.email = 'johndoe@gmail.com';
    });
    it('should return 400 if request body doesn\'t have an email field', async () => {
        req.body.email = undefined;
        await emailInUse(req, res, next);
        expect(res.statusCode).toBe(400);
    });
    it('should return 500 if error is thrown', async () => {
        User.find.mockImplementation(() => {
            throw new Error();
        });
        await emailInUse(req, res, next);
        expect(res.statusCode).toBe(500);
    });
    it('should call next if everything goes fine', async () => {
        User.find.mockReturnValue([1]);
        await emailInUse(req, res, next);
        expect(next).toBeCalled();
    });
});
