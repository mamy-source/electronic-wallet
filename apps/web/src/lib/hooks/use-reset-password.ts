
"use client";

import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordInput } from "@electronic-wallet/validation";
import { authApi } from "@/lib/api/auth";

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      authApi.resetPassword(input),
    retry: false,
  });
}
