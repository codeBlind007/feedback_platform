import api from "./api";
import { Feedback, FeedbackResponse, FeedbackAnalytics, AnalyticsResponse } from "../types";
import axios from "axios";

export const feedbackService = {
  async createFeedback(payload: { category: string; comments: string }): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/api/v1/feedback", payload);
    return response.data;
  },

  async getUserFeedbacks(): Promise<Feedback[]> {
    try {
      const response = await api.get<FeedbackResponse>("/api/v1/feedback");
      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      }
      return [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async getAllFeedbacks(filters?: { category?: string; status?: string; search?: string }): Promise<Feedback[]> {
    const response = await api.get<FeedbackResponse>("/api/v1/feedback/all-feedbacks", {
      params: filters,
    });
    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    }
    return [];
  },

  async getAnalytics(): Promise<FeedbackAnalytics> {
    const response = await api.get<AnalyticsResponse>("/api/v1/feedback/analytics");
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error("Failed to fetch analytics");
  },

  async respondToFeedback(feedbackId: string, responseText: string): Promise<{ success: boolean; message: string }> {
    const response = await api.patch(`/api/v1/feedback/${feedbackId}/respond`, {
      response: responseText,
    });
    return response.data;
  },
};
