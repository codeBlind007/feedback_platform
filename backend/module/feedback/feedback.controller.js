import { validateCreateFeedbackData } from "./feedback.validation.js";
import feedbackService from "./feedback.service.js";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

const createFeedback = async (req, res) => {
  try {
    const { errors, isValid } = validateCreateFeedbackData(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback data.",
        errors: errors
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
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while creating feedback", 500);
  }
};

const getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await feedbackService.userFeedback(userId);

    if (!result || result.length === 0) {
      throw new AppError("No feedback found for the user", 404);
    }

    res.status(200).json({
      success: true,
      message: "User feedback retrieved successfully",
      data: result,
    });

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while fetching user feedback", 500);
  }
};

const respondToFeedback = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { feedbackId } = req.params;
    const { response } = req.body;

    if (role !== "admin") {
      throw new AppError("Access denied. Only admins can respond to feedback.", 403);
    }

    if (!feedbackId) {
      throw new AppError("Feedback ID is required", 400);
    }

    if (!response) {
      throw new AppError("Response is required", 400);
    }

    const result = await feedbackService.feedbackResponse(feedbackId, response);

    if (!result || result.length === 0) {
      throw new AppError("Feedback not found.", 404);
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
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while responding to feedback", 500);
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "admin") {
      throw new AppError("Access denied. Only admins can access analytics.", 403);
    }

    const analytics = await feedbackService.getAnalyticsService();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while fetching analytics", 500);
  }
};

export const getFeedbacksByAdmin = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "admin") {
      throw new AppError("Access denied. Only admins can access feedbacks.", 403);
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
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("An error occurred while fetching feedbacks", 500);
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
