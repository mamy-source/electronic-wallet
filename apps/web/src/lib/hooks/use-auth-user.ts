"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/lib/api/query-keys";
import { authApi, type AuthUser } from "@/lib/api/auth";

export function useAuthUser() {
  const query = useQuery({
    queryKey: authKeys.session(),
    queryFn: authApi.me,
    retry: false,

    select: (data) => data.user,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: Boolean(query.data),
  };
}

export type { AuthUser };