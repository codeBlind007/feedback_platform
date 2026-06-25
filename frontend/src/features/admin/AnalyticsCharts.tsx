"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import { CATEGORY_LABELS } from "@/constants";
import { FeedbackCategory } from "@/types";

// Neutral gray palette for pie slices
const PIE_COLORS = ["#171717", "#525252", "#737373", "#a3a3a3", "#d4d4d4"];

const SkeletonChart = () => (
  <div className="h-64 w-full rounded bg-neutral-100 animate-pulse" />
);

export function AnalyticsCharts() {
  const { data: analytics, isLoading } = useAnalytics(true);

  const categoryData = (analytics?.categoryDistribution ?? []).map((item) => ({
    name: CATEGORY_LABELS[item.category as FeedbackCategory] ?? item.category,
    value: Number(item.count),
  }));

  const statusData = (analytics?.statusDistribution ?? []).map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: Number(item.count),
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Category Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Distribution</CardTitle>
          <CardDescription>Breakdown of feedback by type</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonChart />
          ) : categoryData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Distribution</CardTitle>
          <CardDescription>Count of feedback entries by current status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonChart />
          ) : statusData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#737373" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
