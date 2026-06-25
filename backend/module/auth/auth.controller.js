import sql from "../../utils/db.js";
import { validateSignupData, validateLoginData } from "./auth.validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../../utils/logger.js"

const signup = async (req, res) => {
  try {
    const { errors, isValid } = validateSignupData(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
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
    logger.error("Signup Failed", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

const login = async (req, res) => {
  try {
    const { errors, isValid } = validateLoginData(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const { email, password } = req.body;
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const userPassword = user.password;
    const isCorrect = await bcrypt.compare(password, userPassword);

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    console.log("from login", logger)
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
    logger.error("Login Failed", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
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
    logger.error("Logout Failed", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User ID not found.",
      });
    }
    const result =
      await sql`SELECT id, full_name, email, role FROM users WHERE id = ${userId}`;
    const user = result[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Fetch User Details Failed", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

const authController = {
  signup,
  login,
  logout,
  getUserDetails,
};

export default authController;
