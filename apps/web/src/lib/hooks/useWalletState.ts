"use client";

import { useState, useCallback } from "react";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/constants/currencies";

export function useWalletState(initial: string = DEFAULT_CURRENCY) {
  const [active, setActive] = useState(initial);

  const switchCurrency = useCallback((code: string) => {
    if (CURRENCIES[code]) setActive(code);
  }, []);

  return {
    active,
    activeConfig: CURRENCIES[active],
    switchCurrency,
  };
}