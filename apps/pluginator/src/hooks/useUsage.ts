/**
 * Usage API hooks
 */

import { api } from "@/lib/api";
import type { LimitCheckResult, UsageReport, UsageStat } from "@/types/tier";
import { useQuery } from "@tanstack/react-query";

const ZERO_STAT: UsageStat = { used: 0, limit: 0, remaining: 0 };

/** Normalize API response to handle both old and new shapes */
function normalizeUsage(raw: Record<string, unknown>): UsageReport {
  const today = raw.today as Record<string, unknown>;
  return {
    tier: raw.tier,
    today: {
      updateChecks: (today.updateChecks ??
        today.checks ??
        ZERO_STAT) as UsageStat,
      downloads: (today.downloads ?? ZERO_STAT) as UsageStat,
      syncs: (today.syncs ?? ZERO_STAT) as UsageStat,
      migrations: (today.migrations ?? ZERO_STAT) as UsageStat,
    },
  } as UsageReport;
}

export function useUsage() {
  return useQuery<UsageReport | null>({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await api.get<Record<string, unknown>>(
        "/v2/pluginator/usage"
      );
      if (!res.success || !res.data) return null;
      return normalizeUsage(res.data);
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: false,
  });
}

export function useCheckLimit(action: "check" | "download" | "sync") {
  return useQuery<LimitCheckResult | null>({
    queryKey: ["usage", "limit", action],
    queryFn: async () => {
      const res = await api.get<LimitCheckResult>(
        `/v2/pluginator/usage/check/${action}`
      );
      if (!res.success) return null;
      return res.data ?? null;
    },
    staleTime: 1000 * 30, // 30 seconds
    retry: false,
  });
}
