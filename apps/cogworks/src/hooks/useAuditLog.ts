import { apiGet } from "@/lib/api";
import type { AuditLogEntry } from "@/types/audit-log";
import { useQuery } from "@tanstack/react-query";

export function useRecentActivity(guildId: string, limit = 5) {
  return useQuery({
    queryKey: ["audit-log", guildId, limit],
    queryFn: async () => {
      const result = await apiGet<{
        items?: AuditLogEntry[];
        logs?: AuditLogEntry[];
      }>(`/guilds/${guildId}/audit-log?limit=${limit}`);
      if (!result.success || !result.data) return [];
      return result.data.items ?? result.data.logs ?? [];
    },
    staleTime: 1000 * 30,
    enabled: !!guildId,
  });
}
