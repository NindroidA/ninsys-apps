import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { deepEqual } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type {
	BaitChannelConfig,
	BaitChannelLog,
	BaitChannelStats,
	BaitChannelStatsResponse,
	BaitChannelWhitelist,
	BaitKeyword,
	JoinEvent,
} from "@/types/bait-channel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** The bot's column defaults. It can't store an empty message. */
export const DEFAULT_BAN_REASON = "Posted in bait channel - Potential bot/scammer";
export const DEFAULT_WARNING_MESSAGE =
	"⚠️ You have posted in a restricted channel. This channel is monitored for unauthorized access.";

/**
 * The config PUT body: only the settings that changed. The API validates every
 * field it gets, and the bot can't clear the bait channel or the messages, so an
 * emptied message is saved as the bot's default and a cleared channel is left out.
 */
export function baitConfigChanges<
	T extends { channelId: string | null; banReason: string; warningMessage: string },
>(form: T, original: T): Partial<T> {
	const next = withDefaultMessages(form);
	const changes: Partial<T> = {};
	for (const key of Object.keys(next) as (keyof T)[]) {
		if (key === "channelId" && next.channelId === null) continue;
		if (!deepEqual(next[key], original[key])) changes[key] = next[key];
	}
	return changes;
}

/** An emptied message is the bot's default text (the form shows it again on save). */
export function withDefaultMessages<T extends { banReason: string; warningMessage: string }>(
	form: T,
): T {
	return {
		...form,
		banReason: form.banReason.trim() ? form.banReason : DEFAULT_BAN_REASON,
		warningMessage: form.warningMessage.trim() ? form.warningMessage : DEFAULT_WARNING_MESSAGE,
	};
}

/** The bot sends score buckets as an object; the chart wants rows. */
export function normalizeBaitStats(raw: BaitChannelStatsResponse): BaitChannelStats {
	return {
		total: raw.total ?? 0,
		actionBreakdown: raw.actionBreakdown ?? {},
		overrideRate: raw.overrideRate ?? 0,
		overriddenCount: raw.overriddenCount ?? 0,
		scoreDistribution: Object.entries(raw.scoreDistribution ?? {}).map(([bucket, count]) => ({
			bucket,
			count,
		})),
		topFlags: raw.topFlags ?? [],
	};
}

/** The names of the flags that fired on a detection. */
export function firedFlags(flags: BaitChannelLog["detectionFlags"]): string[] {
	return Object.entries(flags ?? {})
		.filter(([, fired]) => fired)
		.map(([flag]) => flag);
}

// --- Config ---

export function useBaitChannelConfig(guildId: string) {
	return useQuery({
		queryKey: ["bait-channel", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<BaitChannelConfig | null>(
				`/guilds/${guildId}/bait-channel/config`,
			);
			// The API answers 502/503 when it can't read the bot's half of the settings.
			// Throw so the tab shows an error: a form of defaults would overwrite them on save.
			if (!result.success) throw new Error(result.error ?? "Failed to load bait channel settings");
			// null: bait channel not set up for this guild.
			return result.data ?? null;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateBaitChannelConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<Omit<BaitChannelConfig, "guildId">>) => {
			const result = await apiPut<BaitChannelConfig>(
				`/guilds/${guildId}/bait-channel/config`,
				data,
			);
			return throwOnApiError(result, "Failed to update config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "config", guildId],
			});
			toast.success("Bait channel config updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Whitelist ---

export function useBaitChannelWhitelist(guildId: string) {
	return useQuery({
		queryKey: ["bait-channel", "whitelist", guildId],
		queryFn: async () => {
			const result = await apiGet<BaitChannelWhitelist>(
				`/guilds/${guildId}/bait-channel/whitelist`,
			);
			// 404: bait channel not set up. Any other failure throws, like the config: an
			// empty list here would replace the real one on save.
			if (!result.success && result.status === 404) return null;
			if (!result.success || !result.data) {
				throw new Error(result.error ?? "Failed to load the whitelist");
			}
			return {
				whitelistedRoles: result.data.whitelistedRoles ?? [],
				whitelistedUsers: result.data.whitelistedUsers ?? [],
			};
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateBaitChannelWhitelist(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BaitChannelWhitelist) => {
			const result = await apiPut<BaitChannelWhitelist>(
				`/guilds/${guildId}/bait-channel/whitelist`,
				data,
			);
			return throwOnApiError(result, "Failed to update whitelist");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "whitelist", guildId],
			});
			toast.success("Whitelist updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Logs ---

interface BaitLogParams {
	page?: number;
	limit?: number;
	/** A stored actionTaken value ('ban', 'kick', 'timeout', 'logged', ...). */
	action?: string;
	scoreMin?: number;
}

export function useBaitChannelLogs(guildId: string, params: BaitLogParams = {}) {
	const { page = 1, limit = 20, action, scoreMin } = params;

	return useQuery({
		queryKey: ["bait-channel", "logs", guildId, { page, limit, action, scoreMin }],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				sort: "createdAt",
				order: "DESC",
			});
			if (action) searchParams.set("action", action);
			if (scoreMin !== undefined) searchParams.set("scoreMin", String(scoreMin));

			const result = await apiGet<PaginatedResponse<BaitChannelLog>>(
				`/guilds/${guildId}/bait-channel/logs?${searchParams}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as BaitChannelLog[],
					pagination: { page, limit, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

// --- Override ---

export function useOverrideBaitLog(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		// The bot overrides the user's newest detection. logId is for when the API and
		// the bot accept it; until then it is ignored.
		mutationFn: async ({ userId, logId }: { userId: string; logId: number }) => {
			const result = await apiPost(`/guilds/${guildId}/bait-channel/override`, {
				userId,
				logId,
			});
			return throwOnApiError(result, "Failed to override detection");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "logs", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "stats", guildId],
			});
			toast.success("Detection marked as false positive");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Stats ---

export function useBaitChannelStats(guildId: string, days = 30) {
	return useQuery({
		queryKey: ["bait-channel", "stats", guildId, days],
		queryFn: async () => {
			const result = await apiGet<BaitChannelStatsResponse>(
				`/guilds/${guildId}/bait-channel/detection-stats?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return normalizeBaitStats(result.data);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

// --- Keywords ---

export function useBaitKeywords(guildId: string) {
	return useQuery({
		queryKey: ["bait-channel", "keywords", guildId],
		queryFn: async () => {
			const result = await apiGet<{ keywords: BaitKeyword[] }>(
				`/guilds/${guildId}/bait-channel/keywords`,
			);
			if (!result.success || !result.data) return [];
			return result.data.keywords ?? [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useAddBaitKeyword(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { keyword: string; weight?: number }) => {
			const result = await apiPost(`/guilds/${guildId}/bait-channel/keywords`, data);
			return throwOnApiError(result, "Failed to add keyword");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "keywords", guildId],
			});
			toast.success("Keyword added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useRemoveBaitKeyword(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (keyword: string) => {
			const result = await apiDelete(`/guilds/${guildId}/bait-channel/keywords`, { keyword });
			return throwOnApiError(result, "Failed to remove keyword");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "keywords", guildId],
			});
			toast.success("Keyword removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useResetBaitKeywords(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiPost(`/guilds/${guildId}/bait-channel/keywords/reset`);
			return throwOnApiError(result, "Failed to reset keywords");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bait-channel", "keywords", guildId],
			});
			toast.success("Keywords reset to defaults");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Join Events ---

/** The bot returns at most 200 events, newest first. */
export function useBaitJoinEvents(guildId: string, limit = 200) {
	return useQuery({
		queryKey: ["bait-channel", "join-events", guildId, limit],
		queryFn: async () => {
			const result = await apiGet<{ joinEvents: JoinEvent[]; count: number }>(
				`/guilds/${guildId}/bait-channel/join-events?limit=${limit}`,
			);
			if (!result.success || !result.data) return [];
			return result.data.joinEvents ?? [];
		},
		staleTime: 1000 * 60 * 2,
		enabled: !!guildId,
	});
}
