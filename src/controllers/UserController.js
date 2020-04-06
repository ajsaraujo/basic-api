// Dependências externas 
const bcrypt = require('bcrypt'); 

// Models e Controllers
const User = require('../models/User'); 
const PasswordController = require('./PasswordController'); 
const TokenController = require('./TokenController'); 
const Validator = require('./RequestValidationController'); 
const EmailController = require('./EmailController'); 

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
}); 

class UserController {

    async create(req, res) {
        const email = req.body.email; 

        let requestBodyIsValid = Validator.nameEmailAndPassword(req.body); 
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.'});
        }

        let userExists; 
        
        try {
            userExists = await User.findOne({ email });
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }

        if (userExists) {
            return res.status(409).json({ error: 'O e-mail informado já está em uso.' });
        }

        try {
            var newUser = await User.create(req.body); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao criar usuário.' }); 
        }

        newUser.password = undefined; 

        return res.status(201).json({ user: newUser, token: TokenController.makeUserToken(newUser.id) }); 
    }

    async update(req, res) {
        const { email, name, password } = req.body; 

        let requestBodyIsValid = Validator.onlyEmail(req.body);

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

        let requestBodyIsValid = Validator.onlyEmail(req.body); 

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

        let requestBodyIsValid = Validator.emailAndPassword(req.body); 

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
            return res.json({ user, token: TokenController.makeUserToken(user.id) }); 
        }
    }

    async recoverPassword(req, res) {

        const userEmail = req.body.email;
        
        let requestBodyIsValid = Validator.onlyEmail(req.body);
        
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
        
        const newRandomPassword = PasswordController.makeRandomPassword(); 

        user.password = newRandomPassword;
        
        try {
            user.save(); 
        } catch (err) {
            console.log('ERRO: ' + err); 
            return res.status(500).json({ error: 'Erro ao mudar senha do usuário.' }); 
        }

        EmailController.sendRecoveryEmail(user.email, newRandomPassword, function(err, info) {
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