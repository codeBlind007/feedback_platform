import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user", authMiddleware, authController.getUserDetails);

export default router;
