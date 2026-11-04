export function TrustStrip() {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-on-surface-variant type-caption-micro">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>All Transaction Rails Operational</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">public</span>
          <span>Madagascar Interbank Clearing • BOA / BNI / BMOI Sync</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">contact_support</span>
          <span>Emergency Lock: <span className="font-semibold text-on-surface">+261 20 22 000 00</span></span>
        </div>
      </div>
    );
  }