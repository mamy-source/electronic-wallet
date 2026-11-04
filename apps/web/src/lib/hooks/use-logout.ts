"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { authKeys } from "@/lib/api/query-keys";

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      qc.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
      router.refresh();
    },
    
    onError: () => {
      qc.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
      router.refresh();
    },
  });
}