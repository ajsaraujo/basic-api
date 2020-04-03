const User = require('../models/User'); 
const yup = require('yup'); 
const bcrypt = require('bcrypt'); 

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

        return res.status(201).json(newUser); 
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
            return res.json(user); 
        }
    }
}

module.exports = new UserController();  