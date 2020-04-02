const User = require('../models/User'); 
const yup = require('yup'); 

class UserController {

    async create(req, res) {
        const email = req.body.email; 

        const schema = yup.object().shape(
            {
               name: yup.string().required(), 
               email: yup.string().required().email(), 
               password: yup.string().required()
            }
        );

        let requestBodyIsValid = schema.isValid(req.body); 
        
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
}

module.exports = new UserController();  