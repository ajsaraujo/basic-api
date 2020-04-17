const jwt = require('jsonwebtoken'); 

class TokenHelper {
    makeUserToken(userId) {
        console.log('id: ' + userId);
        console.log('secret: ' + process.env.JWT_SECRET);
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
    }

}

module.exports = new TokenHelper();