"use client";

import { useFeeCalculator } from "@/lib/hooks/useFeeCalculator";
import { Icon } from "@/components/ui/Icon";

const formatAr = (n: number) => `${n.toLocaleString("en-US")} Ar`;

export function FeeBreakdown() {
  const { amount, setAmount, monexaFee, traditionalFee, recipientGets, savings } =
    useFeeCalculator();

  return (
    <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 flex flex-col space-y-5">
          <div>
            <label
              htmlFor="calc-send-amount"
              className="block font-label-md text-label-md font-semibold text-on-surface mb-2"
            >
              You Send Amount (MGA)
            </label>
            <div className="relative flex items-center">
              <input
                id="calc-send-amount"
                type="number"
                min={1000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-12 pl-4 pr-16 rounded-xl bg-surface-container-low text-on-surface font-balance-numeral-md text-balance-numeral-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
              <span className="absolute right-4 font-label-md text-label-md font-bold text-on-surface-variant">
                Ar
              </span>
            </div>
            <p className="font-caption-micro text-caption-micro text-on-surface-variant mt-2">
              Adjust input to view fee thresholds (e.g. transfers ≤ 50,000 Ar incur 0 Ar fee).
            </p>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm font-medium text-on-surface-variant mb-2">
              Destination Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-surface-container flex items-center gap-2 cursor-pointer">
                <Icon name="phone_android" className="text-primary text-[18px]" />
                <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                  Any Mobile Wallet
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-2 cursor-pointer">
                <Icon name="account_balance" className="text-on-surface-variant text-[18px]" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Commercial Bank
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-xl">
          <h4 className="font-label-md text-label-md font-semibold text-on-surface mb-4">
            Live Fee Breakdown
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                  MONEXA Fee
                </span>
              </div>
              <span className="font-label-md text-label-md font-bold text-primary">
                {formatAr(monexaFee)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <Icon name="store" className="text-tertiary text-[20px]" />
                <span className="font-label-sm text-label-sm">
                  Traditional Telecom (3.5%)
                </span>
              </div>
              <span className="font-label-md text-label-md font-medium text-on-surface-variant">
                {formatAr(traditionalFee)}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                  Recipient Actually Receives
                </p>
                <p className="font-caption-micro text-caption-micro text-on-surface-variant">
                  Clean instant ledger deposit
                </p>
              </div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {formatAr(recipientGets)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-highest/60 flex items-center justify-between">
              <span className="font-caption-micro text-caption-micro uppercase tracking-wide font-bold text-primary">
                Estimated Savings
              </span>
              <span className="font-label-md text-label-md font-bold text-primary">
                +{formatAr(savings)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}