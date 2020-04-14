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
        const requestBodyIsValid = ValidationHelper
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
                token: TokenHelper.makeUserToken()
            });
        }

        return res.status(409).json({ error: 'Wrong password.' }); 
    }

    async recoverPassword(req, res) {

        const userEmail = req.body.email;
        const requiredFields = { email: true };
        let requestBodyIsValid = ValidationHelper.validateUser(req.body, requiredFields);
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }
        
        let user; 

        try {
            user = await User.findOne({ email: userEmail });
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao buscar usuário.' }); 
        }
        
        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.' });
        }
        
        const newRandomPassword = PasswordHelper.makeRandomPassword(); 

        user.password = newRandomPassword;
        
        try {
            user.save(); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao mudar senha do usuário.' }); 
        }

        EmailHelper.sendRecoveryEmail(user.email, newRandomPassword, function(err, info) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Erro ao enviar email.' }); 
            } else {
                console.log('Mensagem enviada: ' + info.response);
                return res.json({ message: 'Email enviado.' }); 
            }
        }); 
    }    
}

module.exports = new AccountController();