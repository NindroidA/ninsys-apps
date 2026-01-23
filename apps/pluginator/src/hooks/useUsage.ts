/**
 * Usage API hooks
 */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LimitCheckResult, UsageReport } from "@/types/tier";

export function useUsage() {
	return useQuery<UsageReport | null>({
		queryKey: ["usage"],
		queryFn: async () => {
			const res = await api.get<UsageReport>("/v2/pluginator/usage");
			if (!res.success) return null;
			return res.data ?? null;
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
			const res = await api.get<LimitCheckResult>(`/v2/pluginator/usage/check/${action}`);
			if (!res.success) return null;
			return res.data ?? null;
		},
		staleTime: 1000 * 30, // 30 seconds
		retry: false,
	});
}
