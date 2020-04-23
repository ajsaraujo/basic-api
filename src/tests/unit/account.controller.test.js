const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const AccountController = require('../../controllers/AccountController');
const User = require('../../models/User');
let req, res, next; 

jest.mock('../../models/User');
jest.mock('bcrypt');

require('dotenv').config();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('AccountController.auth', () => {
    beforeEach(() => {
        req.body = {
            email: 'elliot@ecorp.com',
            password: 'veryveryhard'
        };
        User.findOne.mockReturnValue({
            name: 'Elliot', 
            email: 'elliot@ecorp.com',
            password: 'encryptedpassword68574',
            id: '8g47886dfs84fd35sf83'
        });
    });
    it('should return 400 if request body has missing fields', async () => {
        req.body.email = undefined;
        await AccountController.auth(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 400 if request body has invalid properties', async () => {
        req.body.password = 42;
        await AccountController.auth(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 404 if user is not found', async () => {
        User.findOne.mockReturnValue(undefined);
        await AccountController.auth(req, res);
        expect(res.statusCode).toBe(404);
    });
    it('should return 409 if password is wrong', async () => {
        bcrypt.compare.mockReturnValue(false);
        await AccountController.auth(req, res);
        expect(res.statusCode).toBe(409);
    });
    it('should return 200 with user and token but no password', async () => {
    });
})