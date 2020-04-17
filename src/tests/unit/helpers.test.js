const PasswordHelper = require('../../helpers/password');

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