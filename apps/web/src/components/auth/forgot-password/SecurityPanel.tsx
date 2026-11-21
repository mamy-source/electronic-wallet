import { Icon } from "@/components/ui/Icon";

export function SecurityPanel() {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Icon name="security" filled className="text-primary text-[22px]" />
            <span className="type-label-md text-on-surface font-bold">
              Institutional Security Standard
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant type-caption-micro uppercase font-semibold">
            Live Audit
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="type-label-sm text-on-surface-variant">Zero-Knowledge Token Validity</span>
            <span className="type-label-sm text-primary font-mono font-semibold">99.98% Cryptographic Proof</span>
          </div>
          <div className="w-full h-12 flex items-end gap-1.5 pt-2">
            {[4, 6, 8, 5, 9, 11, 12, 10, 12].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${i === 7 ? "bg-secondary" : "bg-primary"}`}
                style={{ height: `${(h / 12) * 100}%`, opacity: i === 6 || i === 8 ? 1 : 0.4 + i * 0.05 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 type-caption-micro text-on-surface-variant">
            <span>ECDSA Curve Secp256k1</span>
            <span>Hardware Security Module (HSM)</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: "lock_reset", tone: "text-primary", title: "Automatic Session Revocation", body: "Prevents unauthorized hijackers by clearing bearer tokens globally across Android, iOS, and Web." },
            { icon: "verified", tone: "text-secondary", title: "CSBF Anti-Phishing Guard", body: "MONEXA will never ask for your recovery PIN or USSD secret code over WhatsApp or unscheduled phone calls." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                <Icon name={f.icon} className={`text-[16px] ${f.tone}`} />
              </div>
              <div>
                <span className="type-label-md text-on-surface font-semibold block">{f.title}</span>
                <p className="type-body-sm text-on-surface-variant">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="type-headline-sm text-on-surface">Need immediate assistance?</span>
          <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm">
            <Icon name="support_agent" className="text-[18px]" />
          </div>
        </div>
        <p className="type-body-sm text-on-surface-variant">
          Our certified compliance desk in Antananarivo is available 24/7 for account lockdown and emergency recovery.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <a href="tel:+261202200000" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-bright type-label-sm font-semibold shadow-sm">
            <Icon name="call" className="text-[16px] text-primary" />
            020 22 000 00
          </a>
          <a href="#" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-bright type-label-sm font-semibold shadow-sm">
            <Icon name="forum" className="text-[16px] text-secondary" />
            Live Support Chat
          </a>
        </div>
      </div>
    </div>
  );
}