"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateFeedback } from "@/hooks/useCreateFeedback";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { CATEGORY_OPTIONS } from "@/constants";
import axios from "axios";

const feedbackSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  comments: z
    .string()
    .min(10, "Comments must be at least 10 characters")
    .max(500, "Comments must be at most 500 characters"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const createMutation = useCreateFeedback();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { category: "", comments: "" },
  });

  const commentsValue = watch("comments", "");

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const result = await createMutation.mutateAsync(data);
      if (result.success) {
        toast("Feedback submitted successfully!", "success");
        reset();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.message ?? "Failed to submit feedback.", "error");
      } else {
        toast("Failed to submit feedback.", "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="feedback-category">Category</Label>
        <Select
          id="feedback-category"
          placeholder="Select a category..."
          options={CATEGORY_OPTIONS}
          {...register("category")}
        />
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="feedback-comments">Comments</Label>
          <span className="text-xs text-neutral-400">
            {commentsValue.length}/500
          </span>
        </div>
        <Textarea
          id="feedback-comments"
          placeholder="Describe your feedback in detail..."
          rows={5}
          {...register("comments")}
        />
        {errors.comments && (
          <p className="text-xs text-red-500">{errors.comments.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || createMutation.isPending}
        size="lg"
      >
        {isSubmitting || createMutation.isPending ? "Submitting..." : "Submit feedback"}
      </Button>
    </form>
  );
}
