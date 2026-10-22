"use client";

import { useState } from "react";

export function SessionBanner({ email }: { email: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="w-full max-w-xl mb-4 p-2 sm:p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-[18px]">devices</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="type-label-sm text-on-surface font-semibold truncate">
              Active Session Detected
            </p>
          </div>
          <p className="type-body-sm text-on-surface-variant truncate">
            {email} <span className="text-outline">•</span> Chrome (Antananarivo)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="px-2.5 py-1.5 rounded-lg type-label-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          Switch account
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container hover:opacity-90 type-label-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Log out
        </button>
      </div>
    </div>
  );
}