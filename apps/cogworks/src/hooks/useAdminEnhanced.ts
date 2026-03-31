import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// --- Server Growth ---

export interface ServerGrowth {
	added: number;
	removed: number;
	net: number;
}

export function useServerGrowth(days = 7) {
	return useQuery({
		queryKey: ["admin", "server-growth", days],
		queryFn: async () => {
			const result = await apiGet<ServerGrowth>(`/admin/server-growth?days=${days}`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
	});
}

// --- Activity Feed ---

export interface ActivityEvent {
	type: string;
	description: string;
	guildName: string;
	guildId: string;
	timestamp: string;
}

export function useAdminActivity(limit = 15) {
	return useQuery({
		queryKey: ["admin", "activity", limit],
		queryFn: async () => {
			const result = await apiGet<{ events: ActivityEvent[] }>(`/admin/activity?limit=${limit}`);
			if (!result.success || !result.data) return [];
			return result.data.events ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});
}

// --- Server Events (Join/Leave Log) ---

export interface ServerEvent {
	guildId: string;
	guildName: string;
	guildIcon: string | null;
	action: "joined" | "left";
	memberCount: number;
	createdAt: string;
}

export function useServerEvents(limit = 50) {
	return useQuery({
		queryKey: ["admin", "server-events", limit],
		queryFn: async () => {
			const result = await apiGet<{ events: ServerEvent[] }>(`/admin/server-events?limit=${limit}`);
			if (!result.success || !result.data) return [];
			return result.data.events ?? [];
		},
		staleTime: 1000 * 60 * 5,
	});
}

// --- Status History ---

export interface StatusHistoryEntry {
	level: string;
	message: string;
	setBy: string | null;
	startedAt: string;
	clearedAt: string | null;
	durationSeconds: number | null;
}

export function useStatusHistory(limit = 20) {
	return useQuery({
		queryKey: ["admin", "status-history", limit],
		queryFn: async () => {
			const result = await apiGet<{ entries: StatusHistoryEntry[] }>(
				`/admin/status-history?limit=${limit}`,
			);
			if (!result.success || !result.data) return [];
			return result.data.entries ?? [];
		},
		staleTime: 1000 * 60 * 5,
	});
}

// --- Error Logs ---

export interface ErrorLogEntry {
	message: string;
	severity: "error" | "warn" | "critical";
	source: "api" | "bot";
	endpoint: string | null;
	timestamp: string;
}

export function useErrorLogs(limit = 50) {
	return useQuery({
		queryKey: ["admin", "errors", limit],
		queryFn: async () => {
			const result = await apiGet<{ errors: ErrorLogEntry[] }>(`/admin/errors?limit=${limit}`);
			if (!result.success || !result.data) return [];
			return result.data.errors ?? [];
		},
		staleTime: 1000 * 60,
	});
}

// --- Health History ---

export interface HealthSnapshot {
	apiResponseTimeMs: number | null;
	botLatencyMs: number | null;
	apiHealthy: boolean;
	botHealthy: boolean;
	createdAt: string;
}

export function useHealthHistory(hours = 24) {
	return useQuery({
		queryKey: ["admin", "health-history", hours],
		queryFn: async () => {
			const result = await apiGet<{ snapshots: HealthSnapshot[] }>(
				`/admin/health/history?hours=${hours}`,
			);
			if (!result.success || !result.data) return [];
			return result.data.snapshots ?? [];
		},
		staleTime: 1000 * 60 * 2,
	});
}

// --- Rate Limits ---

export interface RateLimitEntry {
	category: string;
	used: number;
	limit: number;
	remaining: number;
	windowMs: number;
	lastReset: string | null;
}

export function useRateLimits() {
	return useQuery({
		queryKey: ["admin", "rate-limits"],
		queryFn: async () => {
			const result = await apiGet<{ endpoints: RateLimitEntry[] }>("/admin/rate-limits");
			if (!result.success || !result.data) return [];
			return result.data.endpoints ?? [];
		},
		staleTime: 1000 * 60,
	});
}
