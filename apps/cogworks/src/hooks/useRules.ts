import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { RulesConfig } from "@/types/rules";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRulesConfig(guildId: string) {
	return useQuery({
		queryKey: ["rules", guildId],
		queryFn: async () => {
			const result = await apiGet<RulesConfig>(`/guilds/${guildId}/rules`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateRulesConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: Partial<Pick<RulesConfig, "enabled" | "channelId" | "roleId" | "emoji" | "customText">>,
		) => {
			const result = await apiPut<RulesConfig>(`/guilds/${guildId}/rules`, data);
			return throwOnApiError(result, "Failed to update rules config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rules", guildId] });
			toast.success("Rules config updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteRulesConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiDelete(`/guilds/${guildId}/rules`);
			throwOnApiError(result, "Failed to remove rules config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rules", guildId] });
			toast.success("Rules system removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useSetupRules(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiPost<RulesConfig>(`/guilds/${guildId}/rules/setup`, {});
			return throwOnApiError(result, "Failed to post rules message");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rules", guildId] });
			toast.success("Rules message posted!");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
