import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type {
	AnalyticsChannels,
	AnalyticsConfig,
	AnalyticsDashboard,
	AnalyticsGrowth,
	AnalyticsHours,
	AnalyticsOverview,
	AnalyticsPeriod,
	AnalyticsSnapshots,
} from "@/types/analytics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config hooks ---

export function useAnalyticsConfig(guildId: string) {
	return useQuery({
		queryKey: ["analytics", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<AnalyticsConfig>(`/guilds/${guildId}/analytics/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateAnalyticsConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<AnalyticsConfig>) => {
			const result = await apiPost<AnalyticsConfig>(
				`/guilds/${guildId}/analytics/config/update`,
				data,
			);
			return throwOnApiError(result, "Failed to update analytics config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["analytics", "config", guildId],
			});
			toast.success("Analytics settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Legacy aggregate bundle (still supported by the API) ---

export function useAnalyticsDashboard(guildId: string, days = 30) {
	return useQuery({
		queryKey: ["analytics", "dashboard", guildId, days],
		queryFn: async () => {
			const result = await apiGet<AnalyticsDashboard>(
				`/guilds/${guildId}/analytics/dashboard?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

// --- Per-metric hooks (v3.1.2) ---

export function useAnalyticsOverview(guildId: string, days: AnalyticsPeriod = 7) {
	return useQuery({
		queryKey: ["analytics", "overview", guildId, days],
		queryFn: async () => {
			const result = await apiGet<AnalyticsOverview>(
				`/guilds/${guildId}/analytics/overview?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useAnalyticsGrowth(guildId: string, days: AnalyticsPeriod = 30) {
	return useQuery({
		queryKey: ["analytics", "growth", guildId, days],
		queryFn: async () => {
			const result = await apiGet<AnalyticsGrowth>(
				`/guilds/${guildId}/analytics/growth?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useAnalyticsChannels(guildId: string, days: AnalyticsPeriod = 7) {
	return useQuery({
		queryKey: ["analytics", "channels", guildId, days],
		queryFn: async () => {
			const result = await apiGet<AnalyticsChannels>(
				`/guilds/${guildId}/analytics/channels?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useAnalyticsHours(guildId: string, days: AnalyticsPeriod = 7) {
	return useQuery({
		queryKey: ["analytics", "hours", guildId, days],
		queryFn: async () => {
			const result = await apiGet<AnalyticsHours>(
				`/guilds/${guildId}/analytics/hours?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useAnalyticsSnapshots(guildId: string, from: string | null, to: string | null) {
	return useQuery({
		queryKey: ["analytics", "snapshots", guildId, from, to],
		queryFn: async () => {
			if (!from || !to) return null;
			const result = await apiGet<AnalyticsSnapshots>(
				`/guilds/${guildId}/analytics/snapshots?from=${from}&to=${to}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId && !!from && !!to,
	});
}
