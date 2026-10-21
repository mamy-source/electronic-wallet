import type { Transaction } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const TONE_MAP: Record<Transaction["direction"], string> = {
  in: "text-primary",
  out: "text-tertiary",
  swap: "text-secondary",
};

export function TransactionItem({ label, subtitle, amount, direction, icon }: Transaction) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
          <Icon name={icon} className={cn("text-[18px]", TONE_MAP[direction])} />
        </div>
        <div>
          <p className="font-label-sm text-label-sm font-semibold text-on-surface">{label}</p>
          <p className="font-caption-micro text-caption-micro text-on-surface-variant">
            {subtitle}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "font-label-md text-label-md",
          direction === "in" ? "font-bold text-primary" : "font-semibold text-on-surface"
        )}
      >
        {amount}
      </span>
    </div>
  );
}