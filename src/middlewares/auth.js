const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const tokenHeader = req.headers.auth; 

    if (!tokenHeader) {
        return res.status(401).send({ error: 'Requisição sem token.' });
    }

    jwt.verify(tokenHeader, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token inválido.' });
        } else {
            res.locals.authData = decoded;
            return next(); 
        }
    }); 
}

module.exports = auth; 