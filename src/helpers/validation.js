const yup = require('yup'); 

const nameRegex = '^[a-zA-Záéíóúãẽĩõũâêîôû ]{2,50}$';

class ValidationHelper { 
    validateUser = (obj, fieldsRequired) => {
        fieldsRequired = fieldsRequired || {};
        return yup.object().shape(
        {
            name: fieldsRequired.name ? yup.string().required().matches(nameRegex) 
                : yup.string().matches(nameRegex),
            email: fieldsRequired.email ? yup.string().email().required() 
                : yup.string().email(),
            password: fieldsRequired.password ? yup.string().required()
                : yup.string()
        }
        ).isValid(obj);
    };
}

module.exports = new ValidationHelper(); 