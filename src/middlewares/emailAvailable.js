const User = require('../models/User');

const emailIsUsed = (req, res, next) => {
    try {
        const user = await User.find( { email: req.body.email } );
        req.emailIsUsed = Boolean(user);
        return next();
    } catch (err) {
        return res.status(500).json({ error: 'Error searching user'})
    }
}