"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/hooks/use-logout";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import type { AuthUser } from "@/lib/api/auth";

interface UserMenuProps {
  user: AuthUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useLogout();

  const initial =
    user.profile?.firstName?.charAt(0) ??
    user.email.charAt(0).toUpperCase();
  const displayName =
    user.profile?.firstName ?? user.email.split("@")[0];

  // Fermer au clic extérieur
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    setOpen(false);
    logout.mutate();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu profil"
        className={cn(
          "flex items-center gap-2 rounded-full p-1 pr-2 transition-colors duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary",
          open ? "bg-surface-container-high" : "hover:bg-surface-container-high"
        )}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white type-label-sm font-semibold uppercase">
          {initial}
        </span>
        <span className="hidden md:inline max-w-24 truncate type-label-sm font-medium text-on-surface">
          {displayName}
        </span>
        <Icon
          name="expand_more"
          className={cn(
            "hidden md:inline text-[18px] text-on-surface-variant transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl bg-surface-container-lowest shadow-xl border border-outline-variant/20 overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          {/* Identity */}
          <div className="px-4 py-3 border-b border-outline-variant/20">
            <p className="type-label-sm font-semibold text-on-surface truncate">
              {user.profile?.firstName
                ? `${user.profile.firstName} ${user.profile.lastName ?? ""}`.trim()
                : displayName}
            </p>
            <p className="type-caption-micro text-on-surface-variant truncate">
              {user.email}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container type-caption-micro">
              <Icon name="verified_user" className="text-[12px] text-primary" />
              <span className="text-on-surface-variant uppercase tracking-wider font-semibold">
                {user.tier ?? "Tier 0"}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1.5" role="none">
            <MenuItem
              icon="account_circle"
              label="My Account"
              onClick={() => handleNavigate("/account")}
            />
            <MenuItem
              icon="wallet"
              label="My Wallet"
              onClick={() => handleNavigate("/wallet")}
            />
            <MenuItem
              icon="receipt_long"
              label="Transaction History"
              onClick={() => handleNavigate("/wallet/transactions")}
            />
            <MenuItem
              icon="settings"
              label="Settings"
              onClick={() => handleNavigate("/settings")}
            />
          </div>

          {/* Logout */}
          <div className="border-t border-outline-variant/20 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl type-label-sm font-medium text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-60"
            >
              <Icon
                name={logout.isPending ? "progress_activity" : "logout"}
                className={cn(
                  "text-[18px]",
                  logout.isPending && "animate-spin"
                )}
              />
              <span>{logout.isPending ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl type-label-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
    >
      <Icon name={icon} className="text-[18px] text-on-surface-variant" />
      <span>{label}</span>
    </button>
  );
}