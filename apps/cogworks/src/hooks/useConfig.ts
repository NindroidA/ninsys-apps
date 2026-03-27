import { apiGet, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { BotConfig } from "@/types/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useConfig(guildId: string) {
	return useQuery({
		queryKey: ["config", guildId],
		queryFn: async () => {
			const result = await apiGet<BotConfig>(`/guilds/${guildId}/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (config: Partial<BotConfig>) => {
			const result = await apiPut<BotConfig>(`/guilds/${guildId}/config`, config);
			return throwOnApiError(result, "Failed to update config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["config", guildId] });
			toast.success("Configuration saved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
