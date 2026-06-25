"use client";

import React, { useState } from "react";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { useRespondFeedback } from "@/hooks/useRespondFeedback";
import { useToast } from "@/components/Toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { StatusBadge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { Textarea } from "@/components/Textarea";
import { Label } from "@/components/Label";
import { CATEGORY_LABELS } from "@/constants";
import { Feedback, FeedbackCategory } from "@/types";
import { MessageSquarePlus } from "lucide-react";
import axios from "axios";

interface AdminFeedbackTableProps {
  search: string;
  category: string;
  status: string;
}

export function AdminFeedbackTable({ search, category, status }: AdminFeedbackTableProps) {
  const { data: feedbacks, isLoading, isError } = useFeedbacks(true, {
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
  });

  const respondMutation = useRespondFeedback();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openRespondDialog = (fb: Feedback) => {
    setSelectedFeedback(fb);
    setResponseText("");
    setDialogOpen(true);
  };

  const handleRespond = async () => {
    if (!selectedFeedback || !responseText.trim()) return;
    setIsSubmitting(true);
    try {
      await respondMutation.mutateAsync({
        feedbackId: selectedFeedback.id,
        response: responseText.trim(),
      });
      toast("Response submitted successfully!", "success");
      setDialogOpen(false);
      setSelectedFeedback(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.message ?? "Failed to submit response.", "error");
      } else {
        toast("Failed to submit response.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 mr-3" />
        Loading feedback...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-red-500">
        Unable to load feedback. Please try refreshing.
      </p>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-neutral-500">No feedback found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-1/3">Comments</TableHead>
            <TableHead>Admin Response</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((fb) => (
            <TableRow key={fb.id}>
              <TableCell>
                <span className="font-medium text-xs text-neutral-800">
                  {CATEGORY_LABELS[fb.category as FeedbackCategory] ?? fb.category}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={fb.status} />
              </TableCell>
              <TableCell>
                <p className="max-w-xs text-xs text-neutral-600 line-clamp-2">{fb.comments}</p>
              </TableCell>
              <TableCell>
                {fb.admin_response ? (
                  <p className="max-w-xs text-xs text-neutral-600 line-clamp-2">{fb.admin_response}</p>
                ) : (
                  <span className="text-neutral-400 text-xs italic">No response yet</span>
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
              <TableCell className="text-right">
                {fb.status !== "resolved" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openRespondDialog(fb)}
                    className="gap-1.5"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" />
                    Respond
                  </Button>
                ) : (
                  <span className="text-xs text-neutral-400">Resolved</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Respond Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Respond to Feedback"
        description={
          selectedFeedback
            ? `Category: ${CATEGORY_LABELS[selectedFeedback.category as FeedbackCategory] ?? selectedFeedback.category}`
            : undefined
        }
      >
        <div className="space-y-4">
          {selectedFeedback && (
            <div className="rounded-md bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500 mb-1 font-medium uppercase tracking-wide">
                User&rsquo;s comment
              </p>
              <p className="text-sm text-neutral-700">{selectedFeedback.comments}</p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="admin-response">Your response</Label>
            <Textarea
              id="admin-response"
              placeholder="Type your response here..."
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRespond}
              disabled={!responseText.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit response"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
