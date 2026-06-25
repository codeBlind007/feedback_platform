import express from "express";
import feedbackController from "./feedback.controller.js";
import authMiddleware from "../auth/auth.middleware.js";
const router = express.Router();

router
  .post("/", authMiddleware, feedbackController.createFeedback)
  .get("/", authMiddleware, feedbackController.getUserFeedback);

router.post("/:feedbackId/respond", authMiddleware, feedbackController.respondToFeedback);
router.get("/analytics", authMiddleware, feedbackController.getAnalytics);

router.get("/all-feedbacks", authMiddleware, feedbackController.getFeedbacksByAdmin);

export default router;