import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "gradient" | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:brightness-105 shadow-[0_10px_20px_-4px_rgba(0,74,198,0.25)]",
  gradient:
    "bg-gradient-to-r from-primary to-secondary text-on-primary hover:brightness-105 shadow-[0_10px_15px_-3px_rgba(37,99,235,0.15)]",
  secondary:
    "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_1px_3px_0_rgba(11,15,25,0.05)]",
  ghost: "text-on-surface hover:text-primary",
  inverse:
    "bg-surface-container-lowest text-primary hover:bg-surface-container-low shadow-lg",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-label-sm",
  md: "h-11 px-6 text-label-md",
  lg: "h-12 px-8 text-label-md",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseClass, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(baseClass, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
);
ButtonLink.displayName = "ButtonLink";