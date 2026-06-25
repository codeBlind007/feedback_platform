import { validateCreateFeedbackData } from "./feedback.validation.js";
import feedbackService from "./feedback.service.js";
import logger from "../../utils/logger.js";

const createFeedback = async (req, res) => {
  try {
    const { errors, isValid } = validateCreateFeedbackData(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback data.",
        errors,
      });
    }
    const { category, comments } = req.body;
    const { userId } = req.user;

    const result = await feedbackService.createFeedback(
      userId,
      category,
      comments,
    );

    logger.info("Feedback Created", {
      feedbackId: result.id,
      userId: req.user,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
    });
  } catch (error) {
    logger.error("Error creating feedback", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the feedback.",
    });
  }
};

const getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await feedbackService.userFeedback(userId);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feedbacks found for the user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User feedback retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching user feedback", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the feedback.",
    });
  }
};

const respondToFeedback = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { feedbackId } = req.params;
    const { response } = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can respond to feedback.",
      });
    }

    if (!feedbackId) {
      return res.status(400).json({
        success: false,
        message: "Feedback ID is required.",
      });
    }

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response is required.",
      });
    }

    const result = await feedbackService.feedbackResponse(feedbackId, response);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    logger.info("Feedback Responded", {
      feedbackId,
      adminId: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Feedback response updated successfully",
    });
  } catch (error) {
    logger.error("Error updating feedback response", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the feedback response.",
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can access analytics.",
      });
    }

    const analytics = await feedbackService.getAnalyticsService();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error("Analytics Error", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

export const getFeedbacksByAdmin = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can fetch all feedback.",
      });
    }

    const { category, status, search } = req.query;

    const feedbacks = await feedbackService.getFeedbacksServiceByAdmin({
      category,
      status,
      search,
    });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    logger.error("Fetch Feedback Error", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

const feedbackController = {
  createFeedback,
  getUserFeedback,
  respondToFeedback,
  getAnalytics,
  getFeedbacksByAdmin,
};

export default feedbackController;
