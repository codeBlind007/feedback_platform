"use client";

import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/Button";
import { MessageSquare, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-neutral-900" />
          <span className="text-sm font-semibold tracking-tight text-neutral-900">
            FeedbackHub
          </span>
        </div>

        {/* User info + logout */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
              <User className="h-3.5 w-3.5" />
              <span>{user.name}</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 capitalize">
                {user.role}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-neutral-500 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
