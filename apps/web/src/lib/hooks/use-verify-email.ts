"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    retry: false,
  });
}