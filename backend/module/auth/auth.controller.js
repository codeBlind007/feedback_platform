import sql from "../../utils/db.js";
import { validateSignupData, validateLoginData } from "./auth.validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../../utils/logger.js"
import AppError from "../../utils/AppError.js";

const signup = async (req, res) => {
  try {
    const { errors, isValid } = validateSignupData(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid signup data.",
        errors: errors
      });
    }

    const role = "user"; // Default role for new users
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const result = await sql`
            INSERT INTO users (full_name, email, password, role)
            VALUES (${req.body.fullName}, ${req.body.email}, ${hashedPassword}, ${role})
        `;

    logger.info("User Registered", {
      email: req.body.email,
      role: role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred during signup", 500);
  }
};

const login = async (req, res) => {
  try {
    const { errors, isValid } = validateLoginData(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid login data.",
        errors: errors
      });
    }
    const { email, password } = req.body;
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];

    if (!user) {
      throw new AppError("Invalid Email or Password", 404);
    }

    const userPassword = user.password;
    const isCorrect = await bcrypt.compare(password, userPassword);

    if (!isCorrect) {
      throw new AppError("Invalid Email or Password", 400);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    

    logger.info("User Login Success", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred during login", 500);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred during logout", 500);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!userId) {
      throw new AppError("User ID required", 400);
    }
    const result =
      await sql`SELECT id, full_name, email, role FROM users WHERE id = ${userId}`;
    const user = result[0];

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while fetching user details", 500);
  }
};

const authController = {
  signup,
  login,
  logout,
  getUserDetails,
};

export default authController;
