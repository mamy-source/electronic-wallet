"use client";

import { useState, useCallback } from "react";

export function useFaq(initialOpen: number | null = 1) {
  const [openId, setOpenId] = useState<number | null>(initialOpen);

  const toggle = useCallback((id: number) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return { openId, toggle };
}