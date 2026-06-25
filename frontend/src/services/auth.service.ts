import api from "./api";
import {
  User,
  UserResponse,
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
  LogoutResponse,
} from "../types";

export const authService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<UserResponse>("/user");
    const resData = response.data;
    
    if (resData.success) {
      if (resData.data) {
        return {
          id: resData.data.id,
          name: resData.data.full_name,
          email: resData.data.email,
          role: resData.data.role,
        };
      }
      if (resData.user) {
        return {
          id: resData.user.id,
          name: resData.user.name,
          email: resData.user.email,
          role: resData.user.role,
        };
      }
    }
    throw new Error("Authentication failed");
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/api/v1/auth/login", payload);
    return response.data;
  },

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>("/api/v1/auth/signup", payload);
    return response.data;
  },

  async logout(): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>("/api/v1/auth/logout");
    return response.data;
  },
};
