"use client";

import { cn } from "@/lib/utils/cn";

interface NavLinkProps {
  href: string;
  children: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, active, className }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "font-label-md text-label-md transition-colors",
        active
          ? "text-primary font-semibold"
          : "text-on-surface-variant hover:text-on-surface",
        className
      )}
    >
      {children}
    </a>
  );
}