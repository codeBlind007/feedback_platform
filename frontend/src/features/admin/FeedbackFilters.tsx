"use client";

import React from "react";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/constants";
import { Search, X } from "lucide-react";

interface FeedbackFiltersProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onReset: () => void;
}

const ALL_CATEGORIES = [{ value: "", label: "All Categories" }, ...CATEGORY_OPTIONS];
const ALL_STATUSES = [{ value: "", label: "All Statuses" }, ...STATUS_OPTIONS];

export function FeedbackFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onReset,
}: FeedbackFiltersProps) {
  const hasActiveFilters = search || category || status;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <Input
          id="feedback-search"
          type="search"
          placeholder="Search by comments..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter */}
      <Select
        id="feedback-category-filter"
        value={category}
        options={ALL_CATEGORIES}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="sm:w-44"
      />

      {/* Status filter */}
      <Select
        id="feedback-status-filter"
        value={status}
        options={ALL_STATUSES}
        onChange={(e) => onStatusChange(e.target.value)}
        className="sm:w-36"
      />

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1.5 text-neutral-500"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
