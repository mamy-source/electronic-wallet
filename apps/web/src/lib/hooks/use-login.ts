"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { authApi, type LoginChallenge } from "@/lib/api/auth";
import type { LoginUserDto } from "@electronic-wallet/shared";

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();

  return useMutation<LoginChallenge, Error, LoginUserDto>({
    mutationFn: authApi.login,
    retry: false,

    onSuccess: (challenge) => {
      const redirect = params.get("redirect") ?? "/";

      const searchParams = new URLSearchParams({
        challengeId: challenge.challengeId,
        redirect,
      });

      router.push(`/verify-2fa?${searchParams.toString()}`);
    },
  });
}