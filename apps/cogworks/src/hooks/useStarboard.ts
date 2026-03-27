import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type { StarboardConfig, StarboardStats, StarredMessage } from "@/types/starboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStarboardConfig(guildId: string) {
	return useQuery({
		queryKey: ["starboard", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<StarboardConfig>(`/guilds/${guildId}/starboard/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateStarboardConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<StarboardConfig>) => {
			const result = await apiPost<StarboardConfig>(
				`/guilds/${guildId}/starboard/config/update`,
				data,
			);
			return throwOnApiError(result, "Failed to update starboard config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["starboard", "config", guildId],
			});
			toast.success("Starboard settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useStarredMessages(guildId: string, page = 1, sort: "stars" | "date" = "stars") {
	return useQuery({
		queryKey: ["starboard", "messages", guildId, page, sort],
		queryFn: async () => {
			const result = await apiGet<PaginatedResponse<StarredMessage>>(
				`/guilds/${guildId}/starboard/entries?page=${page}&limit=25`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as StarredMessage[],
					pagination: { page, limit: 20, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60 * 2,
		enabled: !!guildId,
	});
}

export function useStarboardStats(guildId: string) {
	return useQuery({
		queryKey: ["starboard", "stats", guildId],
		queryFn: async () => {
			const result = await apiGet<StarboardStats>(`/guilds/${guildId}/starboard/stats`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}
