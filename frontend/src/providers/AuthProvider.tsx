"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, LoginPayload, LoginResponse, SignupPayload, SignupResponse } from "../types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  signup: (payload: SignupPayload) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(false);
  }, []);

  // Enforce role-based routing
  useEffect(() => {
    if (loading) return;

    const isAdminRoute = pathname.startsWith("/admin");
    const isUserRoute = pathname.startsWith("/feedback");
    const isAuthRoute = pathname.startsWith("/login");
    const isRootRoute = pathname === "/";

    if (!user) {
      if (isAdminRoute || isUserRoute) {
        router.push("/login");
      }
    } else {
      if (isAuthRoute || isRootRoute) {
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/feedback");
        }
      } else if (isAdminRoute && user.role !== "admin") {
        router.push("/feedback");
      } else if (isUserRoute && user.role !== "user") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await authService.login(payload);
      if (response.success) {
        await fetchUser();
      }
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
    setLoading(true);
    try {
      const response = await authService.signup(payload);
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  // Render a clean neutral loading state to prevent layout flash during authentication checks
  if (loading && (pathname.startsWith("/admin") || pathname.startsWith("/feedback"))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-neutral-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950"></div>
          <p className="text-sm font-medium tracking-wide">Loading platform...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
