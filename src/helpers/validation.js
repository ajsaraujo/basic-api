const yup = require('yup'); 

class ValidationHelper { 
    nameEmailAndPassword = (req) => yup.object().shape(
        {
            name: yup.string().required(),
            email: yup.string().required().email(),
            password: yup.string().required()
        }
    ).isValid(req); 

    onlyEmail = (req) => yup.object().shape(
        {
            name: yup.string(),
            email: yup.string().required().email(),
            password: yup.string()
        }
    ).isValid(req);

    emailAndPassword = (req) => yup.object().shape(
        {
            email: yup.string().required().email(),
            password: yup.string().required()
        }
    ).isValid(req); 
}

module.exports = new ValidationHelper(); 