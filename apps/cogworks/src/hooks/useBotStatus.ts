import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nindroidsystems.com";

interface BotStatus {
	status: "online" | "idle" | "dnd" | "offline";
	latency: number;
	uptime: number;
	lastRestart: string;
}

interface BotStats {
	serverCount: number;
	userCount: number;
	ticketsCreated: number;
	ticketsClosed: number;
	commandsRun: number;
}

interface BotInfo {
	name: string;
	discriminator: string;
	avatarUrl: string;
	inviteUrl: string;
}

export function useBotStatus() {
	return useQuery<BotStatus>({
		queryKey: ["cogworks", "status"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/v2/cogworks/status`);
			if (!res.ok) {
				throw new Error("Failed to fetch bot status");
			}
			return res.json();
		},
		refetchInterval: 30000, // Refresh every 30 seconds
		staleTime: 10000, // Consider data stale after 10 seconds
		retry: 2,
	});
}

export function useBotStats() {
	return useQuery<BotStats>({
		queryKey: ["cogworks", "stats"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/v2/cogworks/stats`);
			if (!res.ok) {
				throw new Error("Failed to fetch bot stats");
			}
			return res.json();
		},
		refetchInterval: 60000, // Refresh every minute
		staleTime: 30000,
	});
}

export function useBotInfo() {
	return useQuery<BotInfo>({
		queryKey: ["cogworks", "info"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/v2/cogworks/info`);
			if (!res.ok) {
				throw new Error("Failed to fetch bot info");
			}
			return res.json();
		},
		staleTime: 300000, // 5 minutes - this data doesn't change often
	});
}

// Helper to format uptime
export function formatUptime(seconds: number): string {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	const parts = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);

	return parts.join(" ") || "< 1m";
}
