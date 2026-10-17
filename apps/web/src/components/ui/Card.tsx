import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "elevated" | "flat" | "subtle";
}

const VARIANTS = {
  elevated: "bg-surface-container-lowest shadow-lg",
  flat: "bg-surface-container-lowest shadow-sm",
  subtle: "bg-surface-container-low",
} as const;

export function Card({ children, variant = "flat", className, ...rest }: CardProps) {
  return (
    <div className={cn("rounded-2xl", VARIANTS[variant], className)} {...rest}>
      {children}
    </div>
  );
}