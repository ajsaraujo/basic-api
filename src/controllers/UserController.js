const User = require('../models/User'); 
const yup = require('yup'); 
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
}); 

// JsonWebToken 
function createUserToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
}

const createSchema = yup.object().shape(
    {
       name: yup.string().required(), 
       email: yup.string().required().email(), 
       password: yup.string().required()
    }
);

const updateSchema = yup.object().shape(
    {
        name: yup.string(),
        email: yup.string().required().email(),
        password: yup.string()
    }
);

const authSchema = yup.object().shape(
    {
        email: yup.string().required().email(),
        password: yup.string().required()
    }
);

function generateRandomPassword() {
    const minimumLength = 8; 
    const addedLength = Math.floor(Math.random() * 5);
    const length = minimumLength + addedLength; 
    
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; 
    
    let randomPassword = ''; 

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length); 
        let randomChar = charset[randomIndex]; 
        randomPassword += randomChar; 
    }

    return randomPassword; 
}

class UserController {

    async create(req, res) {
        const email = req.body.email; 

        let requestBodyIsValid = createSchema.isValid(req.body); 
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.'});
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({ error: 'O e-mail informado já está em uso.' });
        }

        const newUser = await User.create(req.body); 
        newUser.password = undefined; 

        return res.status(201).json({ user: newUser, token: createUserToken(newUser.id) }); 
    }

    async update(req, res) {
        const { email, name, password } = req.body; 

        let requestBodyIsValid = updateSchema.isValid(req.body); 

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user = await User.findOne({ email }); 

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

        await user.save(); 
        
        user.password = undefined; 
        
        return res.json(user); 
    }

    async delete(req, res) {
        const { email } = req.body.email; 

        let requestBodyIsValid = updateSchema.isValid(req.body); 

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user = await User.findOne({ email }); 
        
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

        user.remove(); 

        return res.json(response); 
    }

    async auth(req, res) {
        const { email, password } = req.body; 

        let requestBodyIsValid = authSchema.isValid(req.body); 

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user = await User.findOne({ email }); 
        
        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.' });
        }

        let passwordIsCorrect = await bcrypt.compare(password, user.password); 
    
        if (!passwordIsCorrect) {
            return res.status(409).json({ error: 'A autenticação falhou.' }); 
        } else {
            user.password = undefined; 
            return res.json({ user, token: createUserToken(user.id) }); 
        }
    }

    async recoverPassword(req, res) {

        const userEmail = req.body.email;

        let requestBodyIsValid = updateSchema.isValid(req.body);

        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Requisição com corpo inválido.' }); 
        }

        let user = await User.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(409).json({ error: 'O e-mail informado não está associado a nenhuma conta.' });
        }
        
        const newRandomPassword = generateRandomPassword(); 
        user.password = newRandomPassword; 
        
        user.password = newRandomPassword; 
        user.save(); 

        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS,
            }
        }); 

        let mailOptions = {
            from: process.env.EMAIL_ACCOUNT, 
            to: userEmail, 
            subject: '[BASIC API] Recuperação de senha',
            html: `
            <p>Esqueceu sua senha?</p>
            </br>
            <p>Não se preocupe, a gente gerou uma nova senha pra você: ${newRandomPassword}</p>
            `,
            text: `Esqueceu sua senha? Não se preocupe, a gente gerou uma nova senha pra você: ${newRandomPassword}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error); 
                return res.status(500).json({ error: 'Erro ao enviar e-mail.'});
            } else {
                console.log('Email enviado: ' + info.response); 
                return res.status(200).json({ message: 'Email enviado.' }); 
            }
        });
    }
}

module.exports = new UserController();  