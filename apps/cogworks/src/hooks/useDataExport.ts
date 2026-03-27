import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { DataExportStatus } from "@/types/data-export";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDataExportStatus(guildId: string) {
	return useQuery({
		queryKey: ["data-export", guildId],
		queryFn: async () => {
			const result = await apiGet<DataExportStatus>(`/guilds/${guildId}/data-export/status`);
			if (!result.success || !result.data) {
				return {
					state: "none",
					downloadUrl: null,
					error: null,
					requestedAt: null,
					completedAt: null,
					nextAvailableAt: null,
				} as DataExportStatus;
			}
			return result.data;
		},
		staleTime: 1000 * 30,
		enabled: !!guildId,
	});
}

export function useRequestDataExport(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiPost<DataExportStatus>(`/guilds/${guildId}/data-export`, {});
			return throwOnApiError(result, "Failed to request export");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["data-export", guildId] });
			toast.success("Export requested");
		},
		onError: (error: Error) => {
			if (error.message.includes("429") || error.message.includes("rate")) {
				toast.error("Export already requested in the last 24 hours");
			} else {
				toast.error(error.message);
			}
		},
	});
}
