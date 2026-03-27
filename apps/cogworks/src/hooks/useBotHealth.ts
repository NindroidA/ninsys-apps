import { apiGet } from "@/lib/api";
import { isBotOfflineError, useBotHealthStore } from "@/stores/botHealthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Lightweight health check that pings the bot status endpoint.
 * Updates the global bot health store so the offline banner can react.
 * Only runs when on dashboard pages (guildId must be truthy).
 */
export function useBotHealth(guildId: string | undefined) {
	const { setOffline, setOnline } = useBotHealthStore();

	const { data, error } = useQuery({
		queryKey: ["bot-health"],
		queryFn: async () => {
			const result = await apiGet<{ status: string }>("/status");
			if (!result.success) {
				if (isBotOfflineError(result.error)) {
					throw new Error("Bot is currently offline");
				}
				// Auth errors (401/403) don't indicate bot status — ignore
				if (result.error?.includes("401") || result.error?.includes("Session expired")) {
					return { online: true };
				}
				// Unknown errors — don't falsely claim online, leave state unchanged
				return { online: null };
			}
			return { online: true as const };
		},
		refetchInterval: 30000,
		staleTime: 15000,
		retry: 1,
		enabled: !!guildId,
	});

	useEffect(() => {
		if (error) {
			setOffline(error.message);
		} else if (data?.online === true) {
			setOnline();
		}
		// data.online === null means unknown — don't change state
	}, [data, error, setOffline, setOnline]);
}
