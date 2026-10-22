export function FastLoginRow({ onPasskey, onMvola }: {
    onPasskey: () => void;
    onMvola: () => void;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="type-caption-micro uppercase tracking-wider text-outline font-semibold">
            Fast Biometric &amp; Carrier Rails
          </span>
          <span className="type-caption-micro text-primary flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Instant
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onPasskey}
            className="group w-full h-11 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center gap-2 type-label-md transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-[20px] group-hover:scale-110 transition-transform">fingerprint</span>
            Passkey / Biometrics
          </button>
          <button
            type="button"
            onClick={onMvola}
            className="group w-full h-11 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center gap-2 type-label-md transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-secondary text-[20px] group-hover:scale-110 transition-transform">sim_card_download</span>
            MVola SIM Push
          </button>
        </div>
      </div>
    );
  }