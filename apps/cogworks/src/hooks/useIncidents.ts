import { apiGet } from "@/lib/api";
import type { CurrentStatus, Incident } from "@/types/incidents";
import { useQuery } from "@tanstack/react-query";

export function useCurrentStatus() {
	return useQuery({
		queryKey: ["incidents", "current"],
		queryFn: async () => {
			const result = await apiGet<CurrentStatus>("/status/incidents/current");
			if (!result.success || !result.data) return null;
			return result.data;
		},
		refetchInterval: 30000,
		staleTime: 15000,
	});
}

export function useIncidentHistory(level?: string, page = 1) {
	return useQuery({
		queryKey: ["incidents", "history", level, page],
		queryFn: async () => {
			const params = new URLSearchParams({ page: String(page), limit: "20" });
			if (level) params.set("level", level);
			const result = await apiGet<{ incidents: Incident[] }>(`/status/incidents/history?${params}`);
			if (!result.success || !result.data) return [];
			return result.data.incidents ?? [];
		},
		staleTime: 1000 * 60,
	});
}
