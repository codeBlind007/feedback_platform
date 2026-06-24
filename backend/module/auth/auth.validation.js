import validator from 'validator';
import bcrypt from 'bcrypt';

export const validateSignupData = (data) => {
    const errors = {}; 
    const {fullName, email, password} = data;

    if (!fullName || !validator.isLength(fullName, { min: 2 })) {
        errors.fullName = 'Full name must be at least 2 characters long.';
    }

    if (!email || !validator.isEmail(email)) {
        errors.email = 'Please provide a valid email address.';
    }

    if (!password || !validator.isLength(password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters long.';
    }

    email = email.toLowerCase();
    password = password.trim();
    password = bcrypt.hashSync(password, 10); 
    
    return { errors, isValid: Object.keys(errors).length === 0 };
};

export const validateLoginData = (data) => {
    const errors = {};
    const { email, password } = data;  

    if (!email || !validator.isEmail(email)) {
        errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    }

    email = email.toLowerCase();

    return { errors, isValid: Object.keys(errors).length === 0 };
}