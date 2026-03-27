import { apiGet } from "@/lib/api";
import type { GuildOverview } from "@/types/overview";
import { useQuery } from "@tanstack/react-query";

export function useOverview(guildId: string) {
	return useQuery({
		queryKey: ["overview", guildId],
		queryFn: async () => {
			const result = await apiGet<GuildOverview>(`/guilds/${guildId}/overview`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}
