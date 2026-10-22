
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth";
import type { RegisterUserDto } from "@electronic-wallet/shared";

export function useRegister() {
  const router = useRouter();

  return useMutation<
    { userId: string; requiresVerification: boolean },
    Error,
    RegisterUserDto
  >({
    mutationFn: authApi.register,

    onSuccess: ({ userId, requiresVerification }) => {
      if (requiresVerification) {
        router.push(
          `/verify-email?userId=${encodeURIComponent(userId)}`
        );
        return;
      }

      router.push("/login");
    },
  });
}
