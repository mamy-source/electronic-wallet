"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, type AuthSession } from "@/lib/api/auth";
import { authKeys } from "@/lib/api/query-keys";
import type { LoginUserDto } from "@electronic-wallet/shared";

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();

  return useMutation<AuthSession, Error, LoginUserDto>({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      qc.setQueryData(authKeys.session(), session);
      const redirect = params.get("redirect") ?? "/wallet";
      router.push(redirect);
      router.refresh();
    },
  });
}