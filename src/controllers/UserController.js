const bcrypt = require('bcrypt'); 

const User = require('../models/User'); 
const PasswordHelper = require('../helpers/password'); 
const TokenHelper = require('../helpers/token'); 
const ValidationHelper = require('../helpers/validation'); 
const EmailHelper = require('../helpers/email'); 

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
}); 

class UserController {
    async create(req, res) {
        try {
            let requestIsValid = ValidationHelper.nameEmailAndPassword(req.body);

            if (!requestIsValid) {
                return res.status(400).json({ error: 'Request with invalid body.' });
            }

            if (req.emailInUse) {
                return res.status(409).json({ error: 'Email already in use.' });
            }

            const user = await User.create(req.body);
            
            return res.status(201).json(user);

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    
    async update(req, res) {
        const { email, name, password } = req.body; 

        let requestBodyIsValid = ValidationHelper.onlyEmail(req.body);

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user; 
        
        try {
            user = await User.findOne({ email }); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }

        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.'});
        }

        const tokenId = res.locals.authData.id; 
        
        if (tokenId != user.id) {
            return res.status(403).json({ error: 'Token referente a outro usuário.' }); 
        }
        
        if (name) {
            user.name = name; 
        }

        if (password) {
            user.password = password; 
        }

        try {
            await user.save(); 
        } catch (err) {
            console.log(err); 
            return res.status(500).json({ error: 'Erro ao salvar mudanças.' }); 
        }
        
        user.password = undefined; 
        
        return res.json(user); 
    }

    async delete(req, res) {
        const { email } = req.body; 

        let requestBodyIsValid = ValidationHelper.onlyEmail(req.body); 

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user; 

        try {
            user = await User.findOne({ email }); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao buscar usuário.'}); 
        }
        
        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.' });
        }

        const tokenId = res.locals.authData.id; 
        
        if (tokenId != user.id) {
            return res.status(403).json({ error: 'Token referente a outro usuário.' }); 
        }

        let response = {
            message: 'Usuário deletado.',
            id: user.id
        }

        try {
            await user.remove(); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao deletar usuário.' }); 
        }

        return res.json(response); 
    }

    async auth(req, res) {
        const { email, password } = req.body; 

        let requestBodyIsValid = ValidationHelper.emailAndPassword(req.body); 

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user; 

        try {
            user = await User.findOne({ email }); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao buscar usuário.' }); 
        }
        
        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.' });
        }

        let passwordIsCorrect = await bcrypt.compare(password, user.password); 
    
        if (!passwordIsCorrect) {
            return res.status(409).json({ error: 'A autenticação falhou.' }); 
        } else {
            user.password = undefined; 
            return res.json({ user, token: TokenHelper.makeUserToken(user.id) }); 
        }
    }

    async recoverPassword(req, res) {

        const userEmail = req.body.email;
        
        let requestBodyIsValid = ValidationHelper.onlyEmail(req.body);
        
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

module.exports = new UserController();  