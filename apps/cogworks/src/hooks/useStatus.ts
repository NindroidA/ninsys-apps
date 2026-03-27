import { apiDelete, apiGet, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { BotStatus, StatusLevel } from "@/types/status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBotStatus(guildId: string) {
	return useQuery({
		queryKey: ["status", guildId],
		queryFn: async () => {
			const result = await apiGet<BotStatus>(`/guilds/${guildId}/status`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useSetBotStatus(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			level: StatusLevel;
			message?: string;
			affectedSystems?: string[];
			estimatedResolution?: string | null;
		}) => {
			const result = await apiPut<BotStatus>(`/guilds/${guildId}/status`, data);
			return throwOnApiError(result, "Failed to set status");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["status", guildId] });
			toast.success("Status updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useClearBotStatus(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiDelete(`/guilds/${guildId}/status`);
			throwOnApiError(result, "Failed to clear status");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["status", guildId] });
			toast.success("Status cleared");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
