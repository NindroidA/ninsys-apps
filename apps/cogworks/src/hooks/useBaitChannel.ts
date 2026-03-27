import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type {
  BaitChannelConfig,
  BaitChannelLog,
  BaitChannelStats,
  BaitChannelWhitelist,
  BaitKeyword,
  JoinEvent,
} from "@/types/bait-channel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config ---

export function useBaitChannelConfig(guildId: string) {
  return useQuery({
    queryKey: ["bait-channel", "config", guildId],
    queryFn: async () => {
      const result = await apiGet<BaitChannelConfig>(
        `/guilds/${guildId}/bait-channel/config`
      );
      if (!result.success || !result.data) return null;
      return result.data;
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
        data
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
        `/guilds/${guildId}/bait-channel/whitelist`
      );
      if (!result.success || !result.data) {
        return { roleIds: [], userIds: [] } as BaitChannelWhitelist;
      }
      return result.data;
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
        data
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
  action?: string;
  minScore?: number;
  maxScore?: number;
}

export function useBaitChannelLogs(
  guildId: string,
  params: BaitLogParams = {}
) {
  const { page = 1, limit = 20, action, minScore, maxScore } = params;

  return useQuery({
    queryKey: [
      "bait-channel",
      "logs",
      guildId,
      { page, limit, action, minScore, maxScore },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (action) searchParams.set("action", action);
      if (minScore !== undefined)
        searchParams.set("minScore", String(minScore));
      if (maxScore !== undefined)
        searchParams.set("maxScore", String(maxScore));

      const result = await apiGet<PaginatedResponse<BaitChannelLog>>(
        `/guilds/${guildId}/bait-channel/logs?${searchParams}`
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
    mutationFn: async (userId: string) => {
      const result = await apiPost(`/guilds/${guildId}/bait-channel/override`, {
        userId,
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
      const result = await apiGet<BaitChannelStats>(
        `/guilds/${guildId}/bait-channel/detection-stats?days=${days}`
      );
      if (!result.success || !result.data) return null;
      return result.data;
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
      const result = await apiGet<BaitKeyword[] | { keywords: BaitKeyword[] }>(
        `/guilds/${guildId}/bait-channel/keywords`
      );
      if (!result.success || !result.data) return [];
      const raw = result.data;
      return Array.isArray(raw) ? raw : raw.keywords ?? [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!guildId,
  });
}

export function useAddBaitKeyword(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { keyword: string; weight?: number }) => {
      const result = await apiPost(
        `/guilds/${guildId}/bait-channel/keywords`,
        data
      );
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
      const result = await apiDelete(
        `/guilds/${guildId}/bait-channel/keywords`,
        { keyword }
      );
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
      const result = await apiPost(
        `/guilds/${guildId}/bait-channel/keywords/reset`
      );
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

export function useBaitJoinEvents(guildId: string, limit = 200) {
  return useQuery({
    queryKey: ["bait-channel", "join-events", guildId, limit],
    queryFn: async () => {
      const result = await apiGet<JoinEvent[] | { events: JoinEvent[] }>(
        `/guilds/${guildId}/bait-channel/join-events?limit=${limit}`
      );
      if (!result.success || !result.data) return [];
      const raw = result.data;
      return Array.isArray(raw) ? raw : raw.events ?? [];
    },
    staleTime: 1000 * 60 * 2,
    enabled: !!guildId,
  });
}
