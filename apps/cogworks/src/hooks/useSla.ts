import { apiGet, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { SlaConfig, SlaStats } from "@/types/sla";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSlaConfig(guildId: string) {
	return useQuery({
		queryKey: ["tickets", "sla", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<SlaConfig>(`/guilds/${guildId}/tickets/sla/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateSlaConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<SlaConfig>) => {
			const result = await apiPut<SlaConfig>(`/guilds/${guildId}/tickets/sla/config`, data);
			return throwOnApiError(result, "Failed to update SLA config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "sla", "config", guildId],
			});
			toast.success("SLA settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useSlaStats(guildId: string, days = 30) {
	return useQuery({
		queryKey: ["tickets", "sla", "stats", guildId, days],
		queryFn: async () => {
			const result = await apiGet<SlaStats>(`/guilds/${guildId}/tickets/sla/stats?days=${days}`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}
