
"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/Button";

type SubmitButtonProps = Omit<
  ComponentProps<typeof Button>,
  "type"
> & {
  loading?: boolean;
  icon?: string;
};

export function SubmitButton({
  loading = false,
  icon = "arrow_forward",
  children,
  disabled,
  variant = "gradient",
  size = "lg",
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`w-full ${className ?? ""}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="material-symbols-outlined animate-spin text-[20px]"
        >
          progress_activity
        </span>
      )}

      <span>{children}</span>

      {!loading && icon && (
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[20px]"
        >
          {icon}
        </span>
      )}
    </Button>
  );
}
