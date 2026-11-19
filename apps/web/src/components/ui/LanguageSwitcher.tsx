"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const LOCALES = ["EN", "FR", "MG"] as const;
type Locale = (typeof LOCALES)[number];

export function LanguageSwitcher() {
  const [active, setActive] = useState<Locale>("EN");

  return (
    <div className="hidden sm:flex items-center bg-surface-container-low rounded-lg p-1">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setActive(locale)}
          className={cn(
            "px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors",
            active === locale
              ? "bg-surface-container-lowest text-primary shadow-[0_1px_3px_0_rgba(11,15,25,0.04)]"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}