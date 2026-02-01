import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "accent";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border-[var(--color-border)]",
  success: "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20",
  error:   "bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)]/20",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
  accent:  "bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
