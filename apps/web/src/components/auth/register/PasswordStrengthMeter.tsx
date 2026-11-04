"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

export interface PasswordChecks {
  length: boolean;
  number: boolean;
  symbol: boolean;
  long: boolean;
}

export function evaluatePassword(pwd: string): PasswordChecks {
  return {
    length: pwd.length >= 8,
    number: /\d/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
    long: pwd.length >= 12,
  };
}

interface Props {
  value: string;
}

export function PasswordStrengthMeter({ value }: Props) {
  const checks = useMemo(() => evaluatePassword(value), [value]);
  const score = [checks.length, checks.number, checks.symbol, checks.long].filter(Boolean).length;

  const label =
    value.length === 0 ? "None" :
    score <= 1 ? "Weak" :
    score === 2 ? "Fair" :
    score === 3 ? "Good" : "Strong";

  const barTone =
    value.length === 0 ? "bg-surface-container-high" :
    score <= 1 ? "bg-error" :
    score === 2 ? "bg-tertiary-container" :
    "bg-primary";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="type-caption-micro text-on-surface-variant font-medium">
          Strength: {label}
        </span>
      </div>
      <div className="w-full grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors",
              value.length === 0
                ? "bg-surface-container-high"
                : i < Math.min(score, 4)
                  ? barTone
                  : "bg-surface-container-high"
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 type-caption-micro">
        <Requirement ok={checks.length} label="8+ Characters" />
        <Requirement ok={checks.number} label="1 Number" />
        <Requirement ok={checks.symbol} label="1 Symbol" />
      </div>
    </div>
  );
}

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={cn("flex items-center gap-1", ok ? "text-primary font-medium" : "text-on-surface-variant")}>
      <span
        className="material-symbols-outlined text-[13px]"
        style={{ fontVariationSettings: ok ? "'FILL' 1" : "'FILL' 0" }}
      >
        {ok ? "check_circle" : "circle"}
      </span>
      <span>{label}</span>
    </div>
  );
}