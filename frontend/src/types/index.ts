export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface BackendUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  data?: BackendUser;
}

export type FeedbackCategory =
  | "bug_report"
  | "feature_request"
  | "general_feedback"
  | "complaint"
  | "suggestion";

export type FeedbackStatus = "pending" | "reviewed" | "resolved";

export interface Feedback {
  id: string;
  user_id?: string;
  category: FeedbackCategory;
  comments: string;
  status: FeedbackStatus;
  admin_response?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  data?: Feedback | Feedback[];
  count?: number;
}

export interface CategoryDistributionItem {
  category: string;
  count: string | number;
}

export interface StatusDistributionItem {
  status: string;
  count: string | number;
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  categoryDistribution: CategoryDistributionItem[];
  statusDistribution: StatusDistributionItem[];
  recentSubmissions: Array<{
    id: string;
    category: FeedbackCategory;
    comments: string;
    status: FeedbackStatus;
    created_at: string;
  }>;
}

export interface AnalyticsResponse {
  success: boolean;
  data: FeedbackAnalytics;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  role: UserRole;
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

