"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  leftIcon?: string;
  rightAdornment?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, hint, error, leftIcon, rightAdornment, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="type-label-sm text-on-surface">
            {label}
          </label>
          {hint && (
            <span className="type-caption-micro text-on-surface-variant">{hint}</span>
          )}
        </div>
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 rounded-lg bg-surface-container-lowest text-on-surface type-body-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
              "placeholder:text-outline",
              leftIcon ? "pl-10 pr-3" : "px-3.5",
              rightAdornment && "pr-11",
              error && "ring-2 ring-error/40",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-3 flex items-center">{rightAdornment}</div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="type-caption-micro text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";