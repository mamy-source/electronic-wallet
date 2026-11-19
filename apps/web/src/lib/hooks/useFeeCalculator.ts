"use client";

import { useMemo, useState } from "react";
import { FEE_CONFIG } from "@/lib/constants/fees";

export function useFeeCalculator(initialAmount = 100_000) {
  const [amount, setAmount] = useState(initialAmount);

  const breakdown = useMemo(() => {
    const val = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    const monexaFee = val <= FEE_CONFIG.FREE_THRESHOLD ? 0 : FEE_CONFIG.MONEXA_FLAT_FEE;
    const traditionalFee = Math.round(val * FEE_CONFIG.TRADITIONAL_RATE);
    const recipientGets = Math.max(0, val - monexaFee);
    const savings = Math.max(0, traditionalFee - monexaFee);

    return { monexaFee, traditionalFee, recipientGets, savings };
  }, [amount]);

  return { amount, setAmount, ...breakdown };
}