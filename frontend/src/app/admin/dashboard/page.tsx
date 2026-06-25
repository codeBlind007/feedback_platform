"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AnalyticsCards } from "@/features/admin/AnalyticsCards";
import { AnalyticsCharts } from "@/features/admin/AnalyticsCharts";
import { FeedbackFilters } from "@/features/admin/FeedbackFilters";
import { AdminFeedbackTable } from "@/features/admin/AdminFeedbackTable";

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Monitor analytics and manage customer feedback.
          </p>
        </div>

        {/* Analytics Cards */}
        <section className="mb-8">
          <AnalyticsCards />
        </section>

        {/* Analytics Charts */}
        <section className="mb-10">
          <AnalyticsCharts />
        </section>

        {/* Feedback Management */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Feedback Management
          </h2>

          {/* Filters */}
          <div className="mb-4">
            <FeedbackFilters
              search={search}
              category={category}
              status={status}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onStatusChange={setStatus}
              onReset={resetFilters}
            />
          </div>

          {/* Table */}
          <AdminFeedbackTable
            search={search}
            category={category}
            status={status}
          />
        </section>
      </main>
    </div>
  );
}
