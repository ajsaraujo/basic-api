const jwt = require('jsonwebtoken');

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
}); 

const auth = (req, res, next) => {
    const tokenHeader = req.headers.auth; 

    if (!tokenHeader) {
        return res.status(401).send({ error: 'No token provided.' });
    }
    
    jwt.verify(tokenHeader, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid token.' });
        } else {
            res.locals.authData = decoded;
            return next(); 
        }
    }); 
}

module.exports = auth; 