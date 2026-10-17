"use client";

import { useWalletState } from "@/lib/hooks/useWalletState";
import { WalletTabs } from "./WalletTabs";
import { TransactionItem } from "./TransactionItem";
import { Icon } from "@/components/ui/Icon";
import type { Transaction } from "@/types";

const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    label: "Inflow from MVola Express",
    subtitle: "Today, 14:20 • Instant Sync",
    amount: "+ 350,000 Ar",
    direction: "in",
    icon: "south_west",
  },
  {
    id: "tx-2",
    label: "Supermaki Ankorondrano QR",
    subtitle: "Yesterday • Merchant Settled",
    amount: "- 84,200 Ar",
    direction: "out",
    icon: "shopping_bag",
  },
  {
    id: "tx-3",
    label: "Converted to EUR Vault",
    subtitle: "Nov 28 • €120.00 credited",
    amount: "- 590,400 Ar",
    direction: "swap",
    icon: "currency_exchange",
  },
];

const QUICK_ACTIONS = [
  { icon: "send", label: "Send", primary: true },
  { icon: "call_received", label: "Request", primary: false },
  { icon: "qr_code_scanner", label: "Scan QR", primary: false },
] as const;

export function WalletPreview() {
  const { active, activeConfig, switchCurrency } = useWalletState();

  return (
    <div className="lg:col-span-5 relative">
      <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-xl relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-sm">
              <Icon name="wallet" className="text-[20px]" />
            </div>
            <div>
              <h3 className="font-label-md text-label-md font-semibold text-on-surface">
                Primary Liquid Vault
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-caption-micro text-caption-micro text-on-surface-variant">
                  Live Ledger ID: MNX-8902-MG
                </span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-primary font-caption-micro text-caption-micro font-medium">
            Verified Active
          </span>
        </div>

        <WalletTabs active={active} onChange={switchCurrency} />

        {/* Balance */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container p-5 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-caption-micro text-caption-micro text-on-surface-variant uppercase tracking-wider">
              Available Balance
            </span>
            <span className="font-caption-micro text-caption-micro text-secondary font-medium">
              {activeConfig.rate}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-balance-numeral-lg text-balance-numeral-lg text-on-surface tracking-tight">
              {activeConfig.amount}
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-semibold">
              {activeConfig.symbol}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-1 font-medium">
              {activeConfig.code}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className={
                  action.primary
                    ? "flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm hover:brightness-105 transition-all"
                    : "flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-all shadow-sm"
                }
              >
                <Icon name={action.icon} className="text-[16px]" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">
              Recent Activity
            </span>
            <a href="#" className="font-caption-micro text-caption-micro text-primary hover:underline">
              View All Ledger
            </a>
          </div>
          <div className="space-y-2.5">
            {RECENT_TRANSACTIONS.map((tx) => (
              <TransactionItem key={tx.id} {...tx} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 z-30 bg-surface-container-lowest p-3.5 rounded-xl shadow-lg">
        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <Icon name="bolt" className="text-[20px]" />
        </div>
        <div>
          <p className="font-label-sm text-label-sm font-semibold text-on-surface">
            0.8s Transfer Average
          </p>
          <p className="font-caption-micro text-caption-micro text-on-surface-variant">
            Faster than SWIFT &amp; local wire
          </p>
        </div>
      </div>
    </div>
  );
}