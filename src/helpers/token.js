const jwt = require('jsonwebtoken'); 

class TokenHelper {
    makeUserToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
    }
}

module.exports = new TokenHelper();