import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "neutral" | "success";
  className?: string;
}

const VARIANTS = {
  primary: "bg-surface-container-high text-primary",
  neutral: "bg-surface-container text-on-surface-variant",
  success: "bg-surface-container text-primary",
} as const;

export function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5",
        "font-label-sm text-label-sm",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}