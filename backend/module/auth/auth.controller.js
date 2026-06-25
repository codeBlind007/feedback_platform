import sql from "../../utils/db.js";
import {validateSignupData, validateLoginData} from './auth.validation.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const signup = async (req, res) => {
    try{
        const { errors, isValid } = validateSignupData(req.body);
    
        if (!isValid) {
            return res.status(400).json({ errors });
        }
        const role = "user"; // Default role for new users
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const result = await sql`
            INSERT INTO users (full_name, email, password, role)
            VALUES (${req.body.fullName}, ${req.body.email}, ${hashedPassword}, ${role})
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

const login = async (req, res) => {
    try{
        const {errors, isValid} = validateLoginData(req.body);

        if(!isValid){
            return res.status(400).json({errors});
        }
        const {email, password} = req.body;
        const result = await sql`SELECT * FROM users WHERE email = ${email}`;
        const user = result[0];

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const userPassword = user.password;
        const isCorrect = await bcrypt.compare(password, userPassword);

        if(!isCorrect){
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });

    }catch(error){
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging in.',
        });
    }
}

const logout = async(req, res) => {
    try{
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }catch(error){
        console.error('Error during logout:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging out.',
        });
    }
}

const getUserDetails = async (req, res) => {
    try{
        const {userId, role} = req.user;
        if(!userId){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User ID not found."
            })
        }
        const result = await sql`SELECT id, full_name, email FROM users WHERE id = ${userId}`;
        const user = result[0];

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            data: user
        });

    }catch(error){
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user details.',
        });
    }
}

const authController = {
    signup,
    login,
    logout,
    getUserDetails
}

export default authController;