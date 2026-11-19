"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "../ui/Logo";
import { useAuthUser } from "@/lib/hooks/use-auth-user";
import { useRouter } from "next/navigation";

export function Header() {
  const [activePath, setActivePath] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  // Empêche le scroll du body quand le drawer est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavigate = (path: string) => {
    setActivePath(path);
    setMobileOpen(false);
  };

  const isAuthenticated = Boolean(user);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 md:gap-6">
        {/* ---------- Left: Logo + Desktop Nav ---------- */}
        <div className="flex items-center gap-6 lg:gap-10 min-w-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate("home");
              router.push("/");
            }}
            className="flex items-center gap-2 shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Accueil"
          >
            <Logo />
          </a>

          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => (
              <div key={link.path} className="relative">
                <NavLink
                  href="#"
                  active={activePath === link.path}
                  onClick={() => handleNavigate(link.path)}
                  className="px-3 py-2 rounded-lg transition-colors hover:bg-surface-container-high/60"
                >
                  {link.label}
                </NavLink>
                {activePath === link.path && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 w-5 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* ---------- Right: Actions ---------- */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* ═══ RAHA TSY CONNECTÉ ═══ */}
          {!isLoading && !isAuthenticated && (
            <>
              <ButtonLink
                variant="ghost"
                href="/login"
                className="hidden md:inline-flex"
              >
                Log In
              </ButtonLink>

              <ButtonLink
                variant="gradient"
                href="/register"
                className="hidden sm:inline-flex"
              >
                Create Account
              </ButtonLink>
            </>
          )}

          {/* ═══ RAHA CONNECTÉ ═══ */}
          {!isLoading && isAuthenticated && user && (
            <div className="hidden md:block">
              <UserMenu user={user} />
            </div>
          )}

          {/* Skeleton kely raha mbola loading */}
          {isLoading && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
              <div className="h-3 w-16 rounded bg-surface-container animate-pulse" />
            </div>
          )}

          {/* Burger — mobile/tablet */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container-high/70 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      <div
        className={`lg:hidden fixed inset-0 top-16 md:top-20 z-40 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        <div
          id="mobile-menu"
          className={`relative bg-surface-container-lowest border-t border-outline-variant/20 shadow-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="px-4 sm:px-6 py-5 flex flex-col gap-1">
            {/* Identité connectée */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-surface-container">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white type-label-md font-semibold uppercase">
                  {user.profile?.firstName?.charAt(0) ?? user.email.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="type-label-sm font-semibold text-on-surface truncate">
                    {user.profile?.firstName ?? user.email.split("@")[0]}
                  </p>
                  <p className="type-caption-micro text-on-surface-variant truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {NAV_LINKS.map((link) => (
              <a
                key={link.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(link.path);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activePath === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface hover:bg-surface-container-high/60"
                }`}
              >
                <span>{link.label}</span>
                {activePath === link.path && (
                  <Icon name="check" className="w-4 h-4" />
                )}
              </a>
            ))}

            <div className="my-4 h-px bg-outline-variant/30" />

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-on-surface-variant">Langue</span>
              <LanguageSwitcher />
            </div>

            {/* Actions mobile selon état auth */}
            <div className="flex flex-col gap-2 mt-4">
              {!isLoading && !isAuthenticated && (
                <>
                  <ButtonLink
                    variant="ghost"
                    href="/login"
                    className="w-full justify-center"
                  >
                    Log In
                  </ButtonLink>
                  <ButtonLink
                    variant="gradient"
                    href="/register"
                    className="w-full justify-center"
                  >
                    Create Account
                  </ButtonLink>
                </>
              )}

              {isAuthenticated && (
                <>
                  <MobileLink
                    icon="account_circle"
                    label="My Account"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/account");
                    }}
                  />
                  <MobileLink
                    icon="wallet"
                    label="My Wallet"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/wallet");
                    }}
                  />
                  <MobileLink
                    icon="settings"
                    label="Settings"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/settings");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      // logout hook — afaka atao eto koa raha tianao
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-error hover:bg-error-container/50 transition-colors"
                  >
                    <Icon name="logout" className="w-5 h-5" />
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
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
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-on-surface hover:bg-surface-container-high/60 transition-colors"
    >
      <Icon name={icon} className="w-5 h-5" />
      {label}
    </button>
  );
}