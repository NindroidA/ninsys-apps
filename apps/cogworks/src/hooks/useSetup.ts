import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { SetupState, SystemId } from "@/types/setup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSetupState(guildId: string) {
	return useQuery({
		queryKey: ["setup", "state", guildId],
		queryFn: async () => {
			const result = await apiGet<SetupState>(`/guilds/${guildId}/setup/state`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 2,
		enabled: !!guildId,
	});
}

export function useToggleSystem(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { systemId: SystemId; enabled: boolean }) => {
			const result = await apiPost<{ selectedSystems: SystemId[] | null }>(
				`/guilds/${guildId}/setup/toggle`,
				data,
			);
			return throwOnApiError(result, "Failed to toggle system");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["setup", "state", guildId] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useBulkUpdateSystems(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (enabledSystems: SystemId[] | null) => {
			const result = await apiPost<{ selectedSystems: SystemId[] | null }>(
				`/guilds/${guildId}/setup/systems`,
				{ enabledSystems },
			);
			return throwOnApiError(result, "Failed to update systems");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["setup", "state", guildId] });
			toast.success("Systems updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

/** Check if a system is enabled based on selectedSystems (null = all enabled) */
export function isSystemEnabled(selectedSystems: SystemId[] | null, systemId: SystemId): boolean {
	if (selectedSystems === null) return true;
	return selectedSystems.includes(systemId);
}
