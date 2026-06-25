"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { LoginForm } from "@/features/auth/LoginForm";
import { SignupForm } from "@/features/auth/SignupForm";
import { MessageSquare } from "lucide-react";

type SelectedRole = "user" | "admin";

export default function LoginPage() {
  const [role, setRole] = useState<SelectedRole>("user");
  // Used to switch tabs programmatically after signup
  const [signupSuccess, setSignupSuccess] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            FeedbackHub
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Collect, manage, and respond to customer feedback.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>

            {/* Role Toggle */}
            <div className="mt-4 flex rounded-lg bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  role === "user"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  role === "admin"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Admin
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {role === "admin" ? (
              /* Admin: Login only */
              <LoginForm role="admin" />
            ) : (
              /* User: Login + Signup tabs */
              <Tabs
                key={signupSuccess ? "after-signup" : "default"}
                tabs={[
                  { id: "login", label: "Login" },
                  { id: "signup", label: "Sign Up" },
                ]}
                defaultTab={signupSuccess ? "login" : "login"}
              >
                {(activeTab) =>
                  activeTab === "login" ? (
                    <LoginForm role="user" />
                  ) : (
                    <SignupForm
                      onSuccess={() => {
                        setSignupSuccess(true);
                      }}
                    />
                  )
                }
              </Tabs>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} FeedbackHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
