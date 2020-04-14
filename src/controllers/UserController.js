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
        const requiredFields = {
            name: true,
            email: true,
            password: true
        };
        const requestIsValid = ValidationHelper
            .validateUser(req.body, requiredFields);

        if (!requestIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }

        if (req.emailInUse) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const user = await User.create(req.body);
            
        return res.status(201).json(
            { user, token: TokenHelper.makeUserToken(user.id) }
        );
    }
    
    async update(req, res) {
        const requestBodyIsValid = ValidationHelper.validateUser(req.body);
        
        if (!requestBodyIsValid) {
            return res.status(400).json({ error: 'Invalid request body.' });
        }
        
        const tokenId = res.locals.authData.id; 
        const userId = req.params.userId; 

        if (tokenId !== userId) {
            return res.status(403).json({ error: 'Token belongs to another user.' });
        }

        const user = await User.findByIdAndUpdate(userId, req.body);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await user.save();
        
        return res.status(200).json(user);
    }

    async delete(req, res) {
        const userId = req.params.userId;
        const tokenId = res.locals.authData.id;

        if (userId !== tokenId) {
            return res.status(403).json({ error: 'Token belongs to another user.' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        return res.status(200).json(user);
    }
}

module.exports = new UserController();  