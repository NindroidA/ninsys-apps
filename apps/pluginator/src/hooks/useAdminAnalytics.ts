/**
 * Admin analytics hooks
 * All endpoints require admin or super_admin role
 */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// --- Types ---

export type AnalyticsPeriod = "1d" | "7d" | "30d" | "all";

export interface AdminKPIs {
	totalUsers: number;
	newSignups: number;
	newSignupsPrevious: number;
	totalDownloads: number;
	totalDownloadsPrevious: number;
	activeSubscriptions: number;
	mrr: number;
	revenuePeriod: number;
	revenuePeriodPrevious: number;
	twoFaAdoptionRate: number;
}

export interface AdminTrends {
	buckets: string[];
	signups: number[];
	signupsCumulative: number[];
	downloads: number[];
	downloadsCumulative: number[];
}

export interface DistributionEntry {
	name: string;
	value: number;
}

export interface AdminDistributions {
	tiers: DistributionEntry[];
	authMethods: DistributionEntry[];
	roles: DistributionEntry[];
}

export interface LeaderboardEntry {
	userId: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	tier: string;
	count: number;
}

export interface AdminLeaderboards {
	topDownloads: LeaderboardEntry[];
	topActivity: LeaderboardEntry[];
}

export interface AdminSystemHealth {
	activeSessions: number;
	sessionsByAuth: { method: string; count: number }[];
	avgSessionsPerUser: number;
	twoFaTotal: number;
	twoFaEnabled: number;
	twoFaAdminTotal: number;
	twoFaAdminEnabled: number;
	usersWithTokens: number;
	totalTokens: number;
	totalUsers: number;
}

export interface AdminUserUsageStats {
	downloads: number;
	updateChecks: number;
	syncs: number;
	migrations: number;
	dailyActivity: { date: string; actions: number }[];
}

// --- Hooks ---

export function useAdminKPIs(period: AnalyticsPeriod) {
	return useQuery({
		queryKey: ["admin-analytics", "kpis", period],
		queryFn: async () => {
			const res = await api.get<AdminKPIs>(`/v2/pluginator/admin/analytics/kpis?period=${period}`);
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load KPIs");
			return res.data;
		},
		staleTime: 1000 * 30,
	});
}

export function useAdminTrends(period: AnalyticsPeriod) {
	return useQuery({
		queryKey: ["admin-analytics", "trends", period],
		queryFn: async () => {
			const res = await api.get<AdminTrends>(
				`/v2/pluginator/admin/analytics/trends?period=${period}`,
			);
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load trends");
			return res.data;
		},
		staleTime: 1000 * 30,
	});
}

export function useAdminDistributions() {
	return useQuery({
		queryKey: ["admin-analytics", "distributions"],
		queryFn: async () => {
			const res = await api.get<AdminDistributions>("/v2/pluginator/admin/analytics/distributions");
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load distributions");
			return res.data;
		},
		staleTime: 1000 * 60,
	});
}

export function useAdminLeaderboards(period: AnalyticsPeriod) {
	return useQuery({
		queryKey: ["admin-analytics", "leaderboards", period],
		queryFn: async () => {
			const res = await api.get<AdminLeaderboards>(
				`/v2/pluginator/admin/analytics/leaderboards?period=${period}&limit=10`,
			);
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load leaderboards");
			return res.data;
		},
		staleTime: 1000 * 30,
	});
}

export function useAdminSystemHealth() {
	return useQuery({
		queryKey: ["admin-analytics", "system-health"],
		queryFn: async () => {
			const res = await api.get<AdminSystemHealth>("/v2/pluginator/admin/analytics/system-health");
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load system health");
			return res.data;
		},
		staleTime: 1000 * 60,
	});
}

export function useAdminUserUsageStats(userId: string, period: AnalyticsPeriod = "30d") {
	return useQuery({
		queryKey: ["admin-analytics", "user-usage", userId, period],
		queryFn: async () => {
			const res = await api.get<AdminUserUsageStats>(
				`/v2/pluginator/admin/users/${userId}/usage-stats?period=${period}`,
			);
			if (!res.success || !res.data) throw new Error(res.error || "Failed to load usage stats");
			return res.data;
		},
		enabled: !!userId,
		staleTime: 1000 * 30,
	});
}
