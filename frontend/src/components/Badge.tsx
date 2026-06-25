import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FeedbackStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 shadow hover:bg-red-500/80",
        outline: "text-neutral-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border border-amber-200",
  reviewed: "bg-blue-50 text-blue-800 border border-blue-200",
  resolved: "bg-green-50 text-green-800 border border-green-200",
};

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

export { Badge, badgeVariants };
