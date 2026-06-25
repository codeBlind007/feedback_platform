"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import { FeedbackForm } from "@/features/feedback/FeedbackForm";
import { UserFeedbackTable } from "@/features/feedback/UserFeedbackTable";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Submit Feedback
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Help us improve by sharing your thoughts, reporting bugs, or requesting features.
          </p>
        </div>

        {/* Feedback Form */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-base">New Feedback</CardTitle>
            <CardDescription>
              Select a category and describe your feedback in detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackForm />
          </CardContent>
        </Card>

        {/* Past Submissions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Your Submissions
          </h2>
          <UserFeedbackTable />
        </div>
      </main>
    </div>
  );
}
