import { Icon } from "@/components/ui/Icon";

export function SidebarBenefits() {
  return (
    <div className="lg:col-span-5 flex flex-col gap-4">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <Icon name="savings" className="text-[20px]" />
            </div>
            <div>
              <h2 className="type-label-md font-bold text-on-surface">Tier 0 Personal Onboarding</h2>
              <p className="type-caption-micro text-on-surface-variant">Instant mobile activation</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary type-label-sm font-bold">
            0 MGA / mo
          </span>
        </div>
        <div className="p-2 rounded-lg bg-surface-container-low flex flex-col gap-2">
          <Row label="Daily Transact Ceiling" value="5,000,000 MGA" />
          <Row label="Inter-Telco Settlement Fee" value="0.00%" valueClass="text-primary font-semibold" />
          <Row label="Dynamic QR Generation" value="Unlimited" valueClass="text-primary font-semibold" />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between type-caption-micro text-on-surface-variant">
            <span>Speed Benchmark vs Standard Wire</span>
            <span className="text-primary font-medium">99.4% Instantaneous</span>
          </div>
          <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex">
            <div className="bg-primary h-full rounded-full" style={{ width: "96%" }} />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-2">
        <h3 className="type-label-md font-bold text-on-surface flex items-center gap-2">
          <Icon name="hub" className="text-[18px] text-secondary" />
          Unified Madagascar Switch
        </h3>
        <p className="type-body-sm text-on-surface-variant">
          MONEXA directly harmonizes all three domestic telco rails under one unified, bank-grade ledger.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { name: "Airtel", wallet: "Airtel Money", dot: "bg-error" },
            { name: "Telma", wallet: "MVola Direct", dot: "bg-secondary-container" },
            { name: "Orange", wallet: "Orange Money", dot: "bg-tertiary-container" },
          ].map((t) => (
            <div key={t.name} className="p-2.5 rounded-lg bg-surface-container-low flex flex-col items-center text-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
              <span className="type-label-sm font-semibold text-on-surface">{t.name}</span>
              <span className="type-caption-micro text-on-surface-variant">{t.wallet}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
            <Icon name="verified" className="text-[24px]" />
          </div>
          <div className="flex flex-col">
            <h4 className="type-label-md font-bold text-on-surface">Regulated Payment Platform</h4>
            <span className="type-caption-micro text-on-surface-variant">CSBF License #098-ETM-2024</span>
          </div>
        </div>
        <p className="type-body-sm text-on-surface-variant pt-1">
          Client funds are ring-fenced in dedicated custodian trusts held at licensed commercial partner banks in Antananarivo.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-2 type-caption-micro">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-low">
            <Icon name="lock_clock" className="text-[16px] text-primary" />
            <span>256-bit AES Vault</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-low">
            <Icon name="phonelink_lock" className="text-[16px] text-primary" />
            <span>SIM Swap Guard</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "font-semibold" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between text-on-surface type-body-sm">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}