"use client";

import React from "react";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { StatusBadge } from "@/components/Badge";
import { CATEGORY_LABELS } from "@/constants";
import { FeedbackCategory } from "@/types";

export function UserFeedbackTable() {
  const { data: feedbacks, isLoading, isError } = useFeedbacks(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-neutral-400 text-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 mr-3" />
        Loading your feedback history...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-red-500">
        Unable to load feedback history. Please refresh the page.
      </p>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-neutral-500">
          There are no submissions from you.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Use the form above to submit your first feedback.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-1/2">Comments</TableHead>
          <TableHead>Admin Response</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbacks.map((fb) => (
          <TableRow key={fb.id}>
            <TableCell>
              <span className="text-neutral-800 font-medium text-xs">
                {CATEGORY_LABELS[fb.category as FeedbackCategory] ?? fb.category}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={fb.status} />
            </TableCell>
            <TableCell>
              <p className="max-w-xs truncate text-neutral-600 text-xs">{fb.comments}</p>
            </TableCell>
            <TableCell>
              {fb.admin_response ? (
                <p className="max-w-xs truncate text-neutral-600 text-xs">{fb.admin_response}</p>
              ) : (
                <span className="text-neutral-400 text-xs italic">Awaiting response</span>
              )}
            </TableCell>
            <TableCell>
              <span className="text-neutral-500 text-xs whitespace-nowrap">
                {new Date(fb.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
