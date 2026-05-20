"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { SafeUser } from "@/lib/auth";

export function useSessionQuery() {
  return useQuery<{ user: SafeUser }>({
    queryKey: ["session"],
    queryFn: () => apiClient.get("/api/auth/session"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

interface ResourceConfig<TList, TDetail, TFilters = unknown> {
  listUrl: string | ((filters?: TFilters) => string);
  detailUrl: (id: string) => string;
  listKey: (filters?: TFilters) => readonly unknown[];
  detailKey: (id: string) => readonly unknown[];
}

export function createResourceHooks<TList, TDetail, TFilters = unknown>(
  config: ResourceConfig<TList, TDetail, TFilters>,
) {
  function useList(filters?: TFilters, options?: Partial<UseQueryOptions<TList>>) {
    const url = typeof config.listUrl === "function" ? config.listUrl(filters) : config.listUrl;
    return useQuery<TList>({
      queryKey: config.listKey(filters),
      queryFn: () => apiClient.get<TList>(url),
      ...options,
    });
  }
  function useDetail(id: string | null | undefined, options?: Partial<UseQueryOptions<TDetail>>) {
    return useQuery<TDetail>({
      queryKey: config.detailKey(id ?? "__none__"),
      queryFn: () => apiClient.get<TDetail>(config.detailUrl(id as string)),
      enabled: !!id,
      ...options,
    });
  }
  return { useList, useDetail };
}
