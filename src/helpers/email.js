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
            subject: '[BASIC API] Recuperação de senha',
            html: `
            <p>Esqueceu sua senha?</p>
            </br>
            <p>Não se preocupe, a gente gerou uma nova senha pra você: ${newRandomPassword}</p>
            `,
            text: `Esqueceu sua senha? Não se preocupe, a gente gerou uma nova senha pra você: ${newRandomPassword}`
        };
        
        transporter.sendMail(mailOptions, callback); 
    }
}

module.exports = new EmailHelper(); 