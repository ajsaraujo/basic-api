const User = require('../models/User');

const emailInUse = async (req, res, next) => {
    if (!req.body.email || typeof req.body.email !== 'string') {
        return res.status(400).json({ error: 'Invalid request body.' });
    }
    
    try {
        const user = await User.find( { email: req.body.email } );
        req.emailInUse = Array.isArray(user) && user.length;
        return next();
    } catch (err) {
        return res.status(500).json({ error: 'Error searching user.' });
    }
}

module.exports = emailInUse;