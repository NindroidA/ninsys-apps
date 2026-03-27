import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type {
	ChannelMultiplier,
	LeaderboardEntry,
	RoleReward,
	XpConfig,
	XpImportResult,
} from "@/types/xp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config ---

export function useXpConfig(guildId: string) {
	return useQuery({
		queryKey: ["xp", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<XpConfig>(`/guilds/${guildId}/xp/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateXpConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<XpConfig>) => {
			const result = await apiPost<XpConfig>(`/guilds/${guildId}/xp/config/update`, data);
			return throwOnApiError(result, "Failed to update XP config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["xp", "config", guildId] });
			toast.success("XP settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Channel Multipliers ---

export function useChannelMultipliers(guildId: string) {
	return useQuery({
		queryKey: ["xp", "multipliers", guildId],
		queryFn: async () => {
			const result = await apiGet<ChannelMultiplier[]>(`/guilds/${guildId}/xp/multipliers`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useAddChannelMultiplier(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { channelId: string; multiplier: number }) => {
			const result = await apiPost(`/guilds/${guildId}/xp/multiplier/set`, data);
			return throwOnApiError(result, "Failed to add multiplier");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["xp", "multipliers", guildId],
			});
			toast.success("Channel multiplier added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useRemoveChannelMultiplier(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (channelId: string) => {
			const result = await apiPost(`/guilds/${guildId}/xp/multiplier/remove`, { channelId });
			return throwOnApiError(result, "Failed to remove multiplier");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["xp", "multipliers", guildId],
			});
			toast.success("Channel multiplier removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Role Rewards ---

export function useRoleRewards(guildId: string) {
	return useQuery({
		queryKey: ["xp", "rewards", guildId],
		queryFn: async () => {
			const result = await apiGet<RoleReward[]>(`/guilds/${guildId}/xp/role-rewards`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useAddRoleReward(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			level: number;
			roleId: string;
			removeOnDelevel: boolean;
		}) => {
			const result = await apiPost(`/guilds/${guildId}/xp/role-rewards/add`, data);
			return throwOnApiError(result, "Failed to add role reward");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["xp", "rewards", guildId] });
			toast.success("Role reward added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteRoleReward(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (rewardId: string) => {
			const result = await apiPost(`/guilds/${guildId}/xp/role-rewards/remove`, { rewardId });
			return throwOnApiError(result, "Failed to delete role reward");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["xp", "rewards", guildId] });
			toast.success("Role reward removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Leaderboard ---

export function useXpLeaderboard(guildId: string, page = 1, search = "") {
	return useQuery({
		queryKey: ["xp", "leaderboard", guildId, page, search],
		queryFn: async () => {
			const params = new URLSearchParams({ page: String(page), limit: "25" });
			if (search) params.set("search", search);
			const result = await apiGet<PaginatedResponse<LeaderboardEntry>>(
				`/guilds/${guildId}/xp/leaderboard?${params}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as LeaderboardEntry[],
					pagination: { page, limit: 25, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60 * 2,
		enabled: !!guildId,
	});
}

// --- Admin Actions ---

export function useSetUserXp(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { userId: string; xp: number }) => {
			const result = await apiPost(`/guilds/${guildId}/xp/user/${data.userId}/set`, {
				xp: data.xp,
			});
			return throwOnApiError(result, "Failed to set XP");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["xp", "leaderboard", guildId],
			});
			toast.success("XP updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useResetUserXp(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			const result = await apiPost(`/guilds/${guildId}/xp/user/${userId}/reset`);
			return throwOnApiError(result, "Failed to reset user XP");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["xp", "leaderboard", guildId],
			});
			toast.success("User XP reset");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useResetAllXp(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiPost(`/guilds/${guildId}/xp/reset-all`);
			return throwOnApiError(result, "Failed to reset all XP");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["xp", "leaderboard", guildId],
			});
			toast.success("All XP data reset");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Import ---

export function useXpImportHistory(guildId: string) {
	return useQuery({
		queryKey: ["xp", "imports", guildId],
		queryFn: async () => {
			const result = await apiGet<XpImportResult[]>(`/guilds/${guildId}/import/history?limit=10`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useImportMee6(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { overwrite?: boolean; dryRun?: boolean }) => {
			const result = await apiPost(`/guilds/${guildId}/import/mee6`, data);
			return throwOnApiError(result, "Failed to start MEE6 import");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["xp", "imports", guildId] });
			toast.success("MEE6 import started");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
