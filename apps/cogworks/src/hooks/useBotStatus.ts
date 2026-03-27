import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface BotStatus {
	status: "online" | "idle" | "dnd" | "offline" | null;
	latency: number | null;
	uptime: number | null;
	lastRestart: string | null;
}

interface BotStats {
	serverCount: number;
	userCount: number;
	ticketsCreated: number;
	ticketsClosed: number;
	commandsRun: number;
}

export function usePublicBotStatus() {
	return useQuery<BotStatus>({
		queryKey: ["cogworks", "status"],
		queryFn: async () => {
			const result = await apiGet<BotStatus>("/status");
			if (!result.success || !result.data) {
				return { status: null, latency: null, uptime: null, lastRestart: null };
			}
			return {
				status: result.data.status ?? null,
				latency: result.data.latency ?? null,
				uptime: result.data.uptime ?? null,
				lastRestart: result.data.lastRestart ?? null,
			};
		},
		refetchInterval: 30000,
		staleTime: 10000,
		retry: 2,
	});
}

export function useBotStats() {
	return useQuery<BotStats>({
		queryKey: ["cogworks", "stats"],
		queryFn: async () => {
			const result = await apiGet<BotStats>("/stats");
			if (!result.success || !result.data) {
				throw new Error("Failed to fetch bot stats");
			}
			return result.data;
		},
		refetchInterval: 60000,
		staleTime: 30000,
	});
}
