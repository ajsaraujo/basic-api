const yup = require('yup'); 

const nameRegex = '^[a-zA-Záéíóúãẽĩõũâêîôû ]{2,50}$';

class ValidationHelper { 
    validateUser = async (obj, fieldsRequired) => {
        fieldsRequired = fieldsRequired || {};

        const fields = [obj.name, obj.email, obj.password];
        for (let value of fields) {
            if (value && typeof value !== 'string') {
                return false;
            }
        }

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