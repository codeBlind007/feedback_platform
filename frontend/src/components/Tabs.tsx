"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <TabsPrimitive.Root
      value={active}
      onValueChange={setActive}
      className={cn("w-full", className)}
    >
      <TabsPrimitive.List className="flex border-b border-neutral-200 w-full mb-4" role="tablist">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none cursor-pointer",
              active === tab.id
                ? "text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-950"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.id} value={tab.id} className="focus-visible:outline-none">
          {active === tab.id && children(active)}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

interface ControlledTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function ControlledTabs({ tabs, activeTab, onTabChange, className }: ControlledTabsProps) {
  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsPrimitive.List className={cn("flex border-b border-neutral-200 w-full", className)} role="tablist">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none cursor-pointer",
              activeTab === tab.id
                ? "text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-950"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
