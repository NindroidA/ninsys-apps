import { apiGet } from "@/lib/api";
import { isBotOfflineError, useBotHealthStore } from "@/stores/botHealthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

/** Body of the public GET /status endpoint (a raw object, not an ApiResponse). */
interface PublicStatusBody {
	online?: unknown;
	lastUpdate?: unknown;
}

/**
 * True when the BFF has not heard from the bot since the BFF itself started.
 * It then reports `online: false` with `lastUpdate` at the Unix epoch. That
 * happens for up to ~5 minutes after every ninsys-api restart or deploy (until
 * the bot's next stats push) and for good when the bot never registers (a
 * dev-mode bot, or a failed boot registration). It says nothing about the bot.
 */
function neverHeardFromBot(lastUpdate: unknown): boolean {
	if (typeof lastUpdate !== "string") return true;
	const time = Date.parse(lastUpdate);
	return Number.isNaN(time) || time <= 0;
}

/**
 * Pings the public bot status endpoint.
 * Resolves `{ online: true }` when the bot is up, `{ online: null }` when the
 * state is unknown, and throws when the bot is offline.
 */
export async function fetchBotHealth(): Promise<{ online: true | null }> {
	const result = await apiGet<PublicStatusBody>("/status");

	// GET /status replies with `{ online, ready, guilds, lastUpdate, ... }` and
	// no `success` envelope, and it returns 200 with `online: false` when the bot
	// has stopped sending heartbeats. Read that field first.
	const body = result as unknown as PublicStatusBody;
	if (body.online === false) {
		if (neverHeardFromBot(body.lastUpdate)) {
			return { online: null };
		}
		throw new Error("Bot is currently offline");
	}
	if (body.online === true) {
		return { online: true };
	}

	// Wrapped error shapes from handleResponse (non-2xx, non-JSON, rate limit)
	if (!result.success) {
		if (isBotOfflineError(result.error)) {
			throw new Error("Bot is currently offline");
		}
		// Auth errors (401/403) don't indicate bot status — ignore
		if (result.error?.includes("401") || result.error?.includes("Session expired")) {
			return { online: true };
		}
	}
	// Unknown errors — don't falsely claim online, leave state unchanged
	return { online: null };
}

/**
 * Lightweight health check that pings the bot status endpoint.
 * Updates the global bot health store so the offline banner can react.
 * Only runs when on dashboard pages (guildId must be truthy).
 */
export function useBotHealth(guildId: string | undefined) {
	const { setOffline, setOnline } = useBotHealthStore();

	const { data, error } = useQuery({
		queryKey: ["bot-health"],
		queryFn: fetchBotHealth,
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
