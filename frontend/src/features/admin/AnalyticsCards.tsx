"use client";

import React from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { MessageSquare, Clock, Eye, CheckCircle2 } from "lucide-react";
import { FeedbackStatus } from "@/types";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
          <div className="rounded-md bg-neutral-100 p-2 text-neutral-600">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsCards() {
  const { data: analytics, isLoading, isError } = useAnalytics(true);

  const getStatusCount = (status: FeedbackStatus): number => {
    if (!analytics?.statusDistribution) return 0;
    const item = analytics.statusDistribution.find((s) => s.status === status);
    return item ? Number(item.count) : 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 rounded bg-neutral-200 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 rounded bg-neutral-200 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">Unable to load analytics. Please try refreshing.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        title="Total Feedback"
        value={analytics?.totalFeedback ?? 0}
        icon={<MessageSquare className="h-4 w-4" />}
        description="All time submissions"
      />
      <StatCard
        title="Pending"
        value={getStatusCount("pending")}
        icon={<Clock className="h-4 w-4" />}
        description="Awaiting response"
      />
      <StatCard
        title="Reviewed"
        value={getStatusCount("reviewed")}
        icon={<Eye className="h-4 w-4" />}
        description="Under review"
      />
      <StatCard
        title="Resolved"
        value={getStatusCount("resolved")}
        icon={<CheckCircle2 className="h-4 w-4" />}
        description="Fully resolved"
      />
    </div>
  );
}
