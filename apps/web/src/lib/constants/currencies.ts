import type { CurrencyConfig } from "@/types";

export const CURRENCIES: Record<string, CurrencyConfig> = {
  MGA: {
    code: "MGA",
    symbol: "Ar",
    label: "MGA (Ariary)",
    amount: "2,845,000",
    rate: "1 USD ≈ 4,550 MGA • Interbank Mid-Market",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    amount: "620.00",
    rate: "1 EUR ≈ 4,920 MGA • Spot Rate Execution",
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    amount: "710.00",
    rate: "1 USD ≈ 4,550 MGA • Zero FX Markup",
  },
};

export const DEFAULT_CURRENCY = "MGA";