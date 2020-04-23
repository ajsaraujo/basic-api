const bcrypt = require('bcrypt');
const User = require('../models/User');

// Helpers
const ValidationHelper = require('../helpers/validation');
const PasswordHelper = require('../helpers/password');
const EmailHelper = require('../helpers/email');
const TokenHelper = require('../helpers/token');

class AccountController {
    async auth(req, res) {
        const requiredFields = { email: true, password: true };
        const requestBodyIsValid = await ValidationHelper
            .validateUser(req.body, requiredFields); 
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const passwordIsOk = await bcrypt.compare(password, user.password);

        if (passwordIsOk) {
            user.password = undefined; 
            return res.status(200).json({ 
                user, 
                token: TokenHelper.makeUserToken(user.id)
            });
        }

        return res.status(409).json({ error: 'Wrong password.' }); 
    }

    async recoverPassword(req, res) {
        const requiredFields = { email: true }; 
        const requestBodyIsValid = ValidationHelper
            .validateUser(req.body, requiredFields);

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }
        
        const { email } = req.body;
        const user = await User.findOne({ email });

        const newRandomPassword = PasswordHelper.makeRandomPassword();
        user.password = newRandomPassword;
        await user.save();

        EmailHelper.sendRecoveryEmail(user.email, newRandomPassword, function(err, info) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error sending email.' }); 
            } else {
                console.log('Mensagem enviada: ' + info.response);
                return res.json({ message: 'Email sent.' }); 
            }
        }); 
    }
}

module.exports = new AccountController();