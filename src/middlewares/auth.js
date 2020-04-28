const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const tokenHeader = req.headers.auth; 
    
    if (!tokenHeader) {
        return res.status(401).send({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(tokenHeader, process.env.JWT_SECRET);
    
        if (decoded.id !== req.params.userId) {
            return res.status(403).json({ error: 'Token belongs to another user.' });
        } 

        return next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = auth; 