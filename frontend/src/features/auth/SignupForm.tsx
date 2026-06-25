"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "@/hooks/useSignup";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import axios from "axios";

const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { toast } = useToast();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signupMutation.mutateAsync(data);
      if (result.success) {
        toast("Account created! Please sign in.", "success");
        reset();
        onSuccess?.();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          const firstError = Object.values(serverErrors)[0] as string;
          toast(firstError, "error");
        } else {
          toast(error.response?.data?.message ?? "Signup failed. Please try again.", "error");
        }
      } else {
        toast("Signup failed. Please try again.", "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="signup-fullname">Full name</Label>
        <Input
          id="signup-fullname"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-email">Email address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || signupMutation.isPending}
        size="lg"
      >
        {isSubmitting || signupMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
