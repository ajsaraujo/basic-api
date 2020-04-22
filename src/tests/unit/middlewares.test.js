require('dotenv').config();

const httpMocks = require('node-mocks-http');
const auth = require('../../middlewares/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

let req, res, next; 

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('auth middleware', () => {
    beforeEach(() => {
        req.headers.auth = 'some_token';
        req.params.userId = 'rgfh4hs6hfh54sg46';
    });
    it('should return 401 to requests without a token', async () => {
        req.headers.auth = undefined;
        await auth(req, res, next);
        expect(res.statusCode).toBe(401);
    });
    it('should return 401 to requests with invalid tokens', async () => {
        req.headers.auth = 'not a valid token';
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });
        await auth(req, res, next);
        expect(res.statusCode).toBe(401);        
    });
    it('should call next when everything is ok', async () => {
        req.headers.auth = 'reittiwerpirwr786deg6s';
        jwt.verify.mockReturnValue({ id: 'rgfh4hs6hfh54sg46'});
        await auth(req, res, next);
        expect(next).toBeCalled();
    });
});
