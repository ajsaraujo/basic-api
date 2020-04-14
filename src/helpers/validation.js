const yup = require('yup'); 

class ValidationHelper { 
    validateUser = (obj, fieldsRequired) => {
        fieldsRequired = fieldsRequired || {};
        return yup.object().shape(
        {
            name: fieldsRequired.name ? yup.string().required() : yup.string(),
            email: fieldsRequired.email ? yup.string().required().email() 
                : yup.string().email(),
            password: fieldsRequired.password ? yup.string().required()
                : yup.string()
        }
        ).isValid(obj)
    };
}

module.exports = new ValidationHelper(); 