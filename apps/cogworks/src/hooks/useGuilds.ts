import { apiGet } from "@/lib/api";
import type { Guild } from "@/types/guild";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "./useAuth";

export function useGuilds() {
	const { isAuthenticated } = useAuth();

	const { data, isLoading, error } = useQuery({
		queryKey: ["auth", "guilds"],
		queryFn: async () => {
			const result = await apiGet<Guild[] | { guilds: Guild[] }>("/auth/guilds");
			if (!result.success || !result.data) return [];
			// Handle both array and { guilds: [...] } response shapes
			const raw = result.data;
			return Array.isArray(raw) ? raw : (raw.guilds ?? []);
		},
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});

	const guilds = useMemo(
		() =>
			[...(data ?? [])].sort((a, b) => {
				if (a.hasBot !== b.hasBot) return a.hasBot ? -1 : 1;
				return a.name.localeCompare(b.name);
			}),
		[data],
	);

	return { guilds, isLoading, error };
}
