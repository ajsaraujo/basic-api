class PasswordHelper {
    makeRandomPassword() {
        const minimumLength = 8; 
        const addedLength = Math.floor(Math.random() * 5);
        const length = minimumLength + addedLength; 
        
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; 
        
        let randomPassword = ''; 
    
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * charset.length); 
            let randomChar = charset[randomIndex]; 
            randomPassword += randomChar; 
        }
        
        return randomPassword; 
    }

}

module.exports = new PasswordHelper(); 