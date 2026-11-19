export type Currency = "MGA" | "EUR" | "USD";

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
  amount: string;
  rate: string;
}

export interface Transaction {
  id: string;
  label: string;
  subtitle: string;
  amount: string;
  direction: "in" | "out" | "swap";
  icon: string;
}

export interface FeatureCard {
  id: string;
  icon: string;
  tone: "primary" | "secondary";
  title: string;
  description: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}