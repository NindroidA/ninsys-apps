import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { RoutingConfig, RoutingStats } from "@/types/routing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoutingConfig(guildId: string) {
  return useQuery({
    queryKey: ["tickets", "routing", "config", guildId],
    queryFn: async () => {
      const result = await apiGet<RoutingConfig>(
        `/guilds/${guildId}/tickets/routing/config`
      );
      if (!result.success || !result.data) return null;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!guildId,
  });
}

export function useUpdateRoutingConfig(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<RoutingConfig>) => {
      const result = await apiPut<RoutingConfig>(
        `/guilds/${guildId}/tickets/routing/config`,
        data
      );
      return throwOnApiError(result, "Failed to update routing config");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets", "routing", "config", guildId],
      });
      toast.success("Routing settings updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAddRoutingRule(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      ticketTypeId: string;
      staffRoleId: string;
      maxOpen: number;
    }) => {
      const result = await apiPost(
        `/guilds/${guildId}/tickets/routing/rules`,
        data
      );
      return throwOnApiError(result, "Failed to add routing rule");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets", "routing", "config", guildId],
      });
      toast.success("Routing rule added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRoutingRule(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      const result = await apiDelete(
        `/guilds/${guildId}/tickets/routing/rules/${ruleId}`
      );
      return throwOnApiError(result, "Failed to delete routing rule");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets", "routing", "config", guildId],
      });
      toast.success("Routing rule removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRoutingStats(guildId: string) {
  return useQuery({
    queryKey: ["tickets", "routing", "stats", guildId],
    queryFn: async () => {
      const result = await apiGet<RoutingStats>(
        `/guilds/${guildId}/tickets/routing/stats`
      );
      if (!result.success || !result.data) return null;
      return result.data;
    },
    staleTime: 1000 * 60 * 2,
    enabled: !!guildId,
  });
}
