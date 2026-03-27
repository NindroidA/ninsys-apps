import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { AnalyticsConfig, AnalyticsDashboard } from "@/types/analytics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAnalyticsConfig(guildId: string) {
  return useQuery({
    queryKey: ["analytics", "config", guildId],
    queryFn: async () => {
      const result = await apiGet<AnalyticsConfig>(
        `/guilds/${guildId}/analytics/config`
      );
      if (!result.success || !result.data) return null;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!guildId,
  });
}

export function useUpdateAnalyticsConfig(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AnalyticsConfig>) => {
      const result = await apiPost<AnalyticsConfig>(
        `/guilds/${guildId}/analytics/config/update`,
        data
      );
      return throwOnApiError(result, "Failed to update analytics config");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["analytics", "config", guildId],
      });
      toast.success("Analytics settings updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAnalyticsDashboard(guildId: string, days = 30) {
  return useQuery({
    queryKey: ["analytics", "dashboard", guildId, days],
    queryFn: async () => {
      const result = await apiGet<AnalyticsDashboard>(
        `/guilds/${guildId}/analytics/dashboard?days=${days}`
      );
      if (!result.success || !result.data) return null;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!guildId,
  });
}
