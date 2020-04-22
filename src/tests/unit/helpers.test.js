const PasswordHelper = require('../../helpers/password');
const ValidationHelper = require('../../helpers/validation');

describe('Validation helper', () => {
    it('should reject objects with missing required fields', async () => {
        const fieldsRequired = { email: true };
        const obj = { name: 'Frank', lastName: 'Cotton' };
        const answer = await ValidationHelper.validateUser(obj, fieldsRequired);
        expect(answer).toBe(false);
    });
    it('should reject emails with invalid formats', async () => {
        const fieldsRequired = { email: true };
        const obj = { email: 'notemail.com' };
        const answer = await ValidationHelper.validateUser(obj, fieldsRequired);
        expect(answer).toBe(false);
    });
    it('should reject names with special characters', async () => {
        const fieldsRequired = { name: true };
        const obj = { name: 'Jul14_C0t40n!@'};
        const answer = await ValidationHelper.validateUser(obj, fieldsRequired);
        expect(answer).toBe(false);
    });
    it('should reject entries with type different than string (1)', async () => {
        const obj = {
            name: 42,
            email: 4.20,
            password: [4, 2]
        };
        const answer = await ValidationHelper.validateUser(obj);
        expect(answer).toBe(false);
    });
    it('should reject entries with type different than string (2)', async () => {
        const obj = {
            name: 'Frank Cotton',
            email: 636,
            password: 'masterofpainandpleasure'
        };
        const answer = await ValidationHelper.validateUser(obj);
        expect(answer).toBe(false);
    });
    it('should accept if everything is ok', async () => {
        const obj = {
            name: 'Frank Cotton',
            email: 'frankfromhell@gmail.com',
            password: 'masterofpainandpleasure'
        };
        const answer = await ValidationHelper.validateUser(obj);
        expect(answer).toBe(true);
    });
});

describe('Password helper', () => {
    it('should have a length between 8 and 12', () => {
        const password = PasswordHelper.makeRandomPassword();
        const condition = password.length >= 8 && password.length <= 12;
        expect(condition).toBeTruthy();
    });
    it('should only contain lowercase letters and numbers', () => {
        const password = PasswordHelper.makeRandomPassword();
        const regex = '^[a-z0-9]*$';
        expect(password.match(regex)).toBeTruthy();
    });
});