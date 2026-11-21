
"use client";

import { useMutation } from "@tanstack/react-query";

import {
  authApi,
  type RecoveryResponse,
} from "@/lib/api/auth";

import type { ForgotPasswordDto } from "@electronic-wallet/shared";

export function useForgotPassword() {
  return useMutation<
    RecoveryResponse,
    Error,
    ForgotPasswordDto
  >({
    mutationFn: (input) =>
      authApi.requestPasswordReset({
        email: input.email,
      }),
  });
}
