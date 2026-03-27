import { useQuery } from "@tanstack/react-query";

interface BotStatusResponse {
	online: boolean;
	ready: boolean;
	guilds: number;
	users: number;
	uptime: number;
	memoryUsageMB: number;
	version: string;
	lastUpdate: string;
	healthStatus: {
		ready: boolean;
		alive: boolean;
		lastCheck: string;
	};
}

interface BotStatsResponse {
	guilds: number;
	users: number;
	channels: number;
	uptime: number;
	ping: number;
	version: string;
	memoryUsage: {
		rss: number;
		heapTotal: number;
		heapUsed: number;
		external: number;
		arrayBuffers: number;
	};
}

export interface BotStatus {
	status: "online" | "offline" | null;
	latency: number | null;
	uptime: number | null;
	lastRestart: string | null;
	version: string | null;
}

export interface BotStats {
	serverCount: number;
	userCount: number;
	channelCount: number;
	uptime: number;
	memoryMB: number;
	version: string;
}

export function usePublicBotStatus() {
	return useQuery<BotStatus>({
		queryKey: ["cogworks", "status"],
		queryFn: async () => {
			const res = await fetch("/v2/cogworks/status");
			if (!res.ok) {
				return { status: null, latency: null, uptime: null, lastRestart: null, version: null };
			}
			const d: BotStatusResponse = await res.json();
			return {
				status: d.online ? "online" : "offline",
				latency: null,
				uptime: d.uptime ?? null,
				lastRestart: d.lastUpdate ?? null,
				version: d.version ?? null,
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
			const res = await fetch("/v2/cogworks/stats");
			if (!res.ok) {
				return { serverCount: 0, userCount: 0, channelCount: 0, uptime: 0, memoryMB: 0, version: "" };
			}
			const d: BotStatsResponse = await res.json();
			return {
				serverCount: d.guilds ?? 0,
				userCount: d.users ?? 0,
				channelCount: d.channels ?? 0,
				uptime: d.uptime ?? 0,
				memoryMB: d.memoryUsage ? Math.round(d.memoryUsage.rss / 1024 / 1024) : 0,
				version: d.version ?? "",
			};
		},
		refetchInterval: 60000,
		staleTime: 30000,
	});
}
