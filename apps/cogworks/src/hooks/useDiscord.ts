import { apiGet, unwrapArray } from "@/lib/api";
import type { DiscordChannel, DiscordRole } from "@/types/guild";
import { useQuery } from "@tanstack/react-query";

export function useChannels(guildId: string) {
	return useQuery({
		queryKey: ["discord", "channels", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/discord/channels`);
			return unwrapArray<DiscordChannel>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useRoles(guildId: string) {
	return useQuery({
		queryKey: ["discord", "roles", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/discord/roles`);
			return unwrapArray<DiscordRole>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}
