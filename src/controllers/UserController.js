const User = require('../models/User'); 
const TokenHelper = require('../helpers/token'); 
const ValidationHelper = require('../helpers/validation'); 

class UserController {
    async getUserData(req, res) {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.json(user);
    }
    
    async createUser(req, res) { 
        const requiredFields = {
            name: true,
            email: true,
            password: true
        };

        const requestIsValid = await ValidationHelper
            .validateUser(req.body, requiredFields);

        if (!requestIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }

        if (req.emailInUse) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const user = await User.create(req.body);
        
        user.password = undefined;
        
        return res.status(201).json(user);
    }
    
    async updateUser(req, res) {
        const requestBodyIsValid = await ValidationHelper.validateUser(req.body);
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }

        let user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = req.body.name || user.name; 
        user.password = req.body.password || user.password;
        
        user = await user.save();

        user.password = undefined; 

        return res.status(200).json(user);
    }

    async deleteUser(req, res) {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        return res.status(200).send('OK');
    }
}

module.exports = new UserController();  