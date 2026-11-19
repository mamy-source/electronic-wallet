"use client";

import { useFaq } from "@/lib/hooks/useFaq";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const FAQ_ITEMS = [
  {
    id: 1,
    question: "How fast are transfers between MONEXA and local mobile money accounts?",
    answer:
      "Transfers occur instantly. Thanks to our direct automated clearing bridges with regional telecom networks (MVola, Orange Money, Airtel Money), cash-ins and cash-outs typically reflect in under 2 seconds.",
  },
  {
    id: 2,
    question: "What documents are required to open a free account?",
    answer:
      "For personal Tier-1 accounts, you only need a valid Malagasy National Identity Card (CIN) or Passport and an active phone number. Business accounts require corporate registration documentation (NIF & STAT).",
  },
  {
    id: 3,
    question: "Are there monthly maintenance fees or minimum balances?",
    answer:
      "No. MONEXA charges zero monthly account maintenance fees, zero inactivity charges, and requires 0 Ar minimum balance. You only pay transparent, ultra-low fees on outbound settlement transfers.",
  },
  {
    id: 4,
    question: "How does the multi-currency wallet handle exchange rates?",
    answer:
      "We source live interbank mid-market exchange rates directly without hidden spreads. When converting between MGA, EUR, or USD, we display the exact conversion rate and apply a flat 0.2% processing fee.",
  },
] as const;

export function FaqSection() {
  const { openId, toggle } = useFaq(1);

  return (
    <section className="w-full py-20 bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
            Got Questions?
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Everything you need to know about setting up your wallet and moving capital safely.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-5 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {item.question}
                  </span>
                  <Icon
                    name="expand_more"
                    className={cn(
                      "text-primary text-[22px] transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 pt-3 text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}