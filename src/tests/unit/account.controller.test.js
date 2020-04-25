const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');

const AccountController = require('../../controllers/AccountController');
const User = require('../../models/User');
const ValidationHelper = require('../../helpers/validation');

let req, res, next; 

jest.mock('../../models/User');
jest.mock('../../helpers/validation');
jest.mock('bcrypt');

require('dotenv').config();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    process.env.JWT_SECRET = 'mysecret';
    process.env.JWT_EXPIRE_TIME = '7d';
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
        ValidationHelper.validateUser.mockReturnValue(true);
    });
    it('should return 400 if request body is invalid', async () => {
        ValidationHelper.validateUser.mockReturnValue(false);
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
        bcrypt.compare.mockReturnValue(true);
        await AccountController.auth(req, res);
        const json = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(json.user).toBeTruthy();
        expect(json.user.password).toBeFalsy();
        expect(json.token).toBeTruthy();
    });
});

describe('AccountController.recoverPassword', () => {
    beforeEach(() => {
        req.body = { email: 'elliot@ecorp.com' };
        ValidationHelper.validateUser.mockReturnValue(true);
    });
    it('should return 400 if request body is invalid', async () => {
        ValidationHelper.validateUser.mockReturnValue(false);
        await AccountController.recoverPassword(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return 404 if account does not exist', async () => {
        User.findOne.mockReturnValue(undefined);
        await AccountController.recoverPassword(req, res);
        expect(res.statusCode).toBe(404);
    });
    it('should call user.save and return 200', async () => {
        // TODO
        expect(true).toBeTruthy();
    });
});