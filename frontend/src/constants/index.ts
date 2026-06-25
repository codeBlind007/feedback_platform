import { FeedbackCategory, FeedbackStatus } from "../types";

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug_report: "Bug Report",
  feature_request: "Feature Request",
  general_feedback: "General Feedback",
  complaint: "Complaint",
  suggestion: "Suggestion",
};

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  resolved: "Resolved",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value: value as FeedbackCategory,
  label,
}));

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as FeedbackStatus,
  label,
}));
