const nodemailer = require('nodemailer'); 

class EmailHelper {
    sendRecoveryEmail(receiverEmail, newRandomPassword, callback) {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS,
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_ACCOUNT, 
            to: receiverEmail, 
            subject: '[BASIC API] Account recovery',
            html: `
            <p>Forgot your password?</p>
            </br>
            <p>Don't worry, we made another one for you: ${newRandomPassword}</p>
            `,
            text: `Forgot your password? Don't worry, we made another one for you: ${newRandomPassword}`
        };
        
        transporter.sendMail(mailOptions, callback); 
    }
}

module.exports = new EmailHelper(); 