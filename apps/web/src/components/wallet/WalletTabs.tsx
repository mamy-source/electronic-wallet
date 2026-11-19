"use client";

import { CURRENCIES } from "@/lib/constants/currencies";
import { cn } from "@/lib/utils/cn";

interface WalletTabsProps {
  active: string;
  onChange: (code: string) => void;
}

export function WalletTabs({ active, onChange }: WalletTabsProps) {
  return (
    <div className="flex items-center p-1 bg-surface-container rounded-lg mb-6">
      {Object.values(CURRENCIES).map((currency) => {
        const isActive = active === currency.code;
        return (
          <button
            key={currency.code}
            type="button"
            onClick={() => onChange(currency.code)}
            className={cn(
              "flex-1 py-1.5 rounded-md font-label-sm text-label-sm font-medium transition-all text-center",
              isActive
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {currency.label}
          </button>
        );
      })}
    </div>
  );
}