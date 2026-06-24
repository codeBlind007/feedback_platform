import { sql } from '../utils/db.js';
import {validateSignupData} from './auth.validation.js';

const signup = async (req, res) => {
    try{
        const { errors, isValid } = validateSignupData(req.body);
    
        if (!isValid) {
            return res.status(400).json({ errors });
        }
    
        const result = await sql`
            INSERT INTO users (full_name, email, password)
            VALUES (${req.body.fullName}, ${req.body.email}, ${req.body.password})
        `
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        })

    }catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while registering the user.',
        });
    }

}