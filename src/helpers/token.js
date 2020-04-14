const jwt = require('jsonwebtoken'); 

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env',
}); 

class TokenHelper {
    makeUserToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
    }

}

module.exports = new TokenHelper();