"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NavLink } from "./NavLink";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "../ui/Logo";

export function Header() {
  const [activePath, setActivePath] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 md:gap-6">
        {/* ---------- Left: Logo + Desktop Nav ---------- */}
        <div className="flex items-center gap-6 lg:gap-10 min-w-0">
          <a
            href="#"
            onClick={() => handleNavigate("home")}
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

          <ButtonLink
            variant="ghost"
            href="#"
            className="hidden md:inline-flex"
          >
            Log In
          </ButtonLink>

          <ButtonLink
            variant="gradient"
            href="#"
            className="hidden sm:inline-flex"
          >
            Create Account
          </ButtonLink>

          {/* Avatar — visible md+ */}
          <button
            type="button"
            className="hidden md:inline-flex rounded-full ring-2 ring-surface-container-high hover:ring-primary/40 transition-all outline-none focus-visible:ring-primary"
            aria-label="Profil utilisateur"
          >
            <img
              alt=""
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1V9jvGIWlvJdRouIZS7-nrHiGFtmBf-f5m9fO0WJ2tIiygoRDHJ3jQ_8UBYQEH6Zf370nnoixvIBMvARVYQIQWJLBLvWpuy3kZH7T_wnYCwmA6bRYWQb1HRK3fIdxoUg7x7E3txTouwZKadqg34JPZlxv8BopK8Ph7_XGnE02DGS0rjOhwffQ2yCi0zS1oZ7_hjr3nZt2D472iupiJmadRSt58p1vkwJ0eJzWLOHoaqYc9h4gdF_9D5rrDXIlmEd5iXLWrOwPTNDA"
            />
          </button>

          {/* Burger — mobile/tablet */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container-high/70 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Icon
              name={mobileOpen ? "close" : "menu"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      <div
        className={`lg:hidden fixed inset-0 top-16 md:top-20 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          id="mobile-menu"
          className={`relative bg-surface-container-lowest border-t border-outline-variant/20 shadow-xl h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="px-4 sm:px-6 py-5 flex flex-col gap-1">
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

            <div className="flex flex-col gap-2 mt-4">
              <ButtonLink variant="ghost" href="#" className="w-full justify-center">
                Log In
              </ButtonLink>
              <ButtonLink variant="gradient" href="#" className="w-full justify-center">
                Create Account
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}