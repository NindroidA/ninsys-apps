import { apiGet } from "@/lib/api";
import type {
	AdminAnalytics,
	AdminHealth,
	AdminOverview,
	AdminServer,
	AdminServerDetail,
} from "@/types/admin";
import type { PaginatedResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function useAdminOverview() {
	return useQuery({
		queryKey: ["admin", "overview"],
		queryFn: async () => {
			const result = await apiGet<AdminOverview>("/admin/overview");
			if (!result.success || !result.data) return null;
			return result.data;
		},
		refetchInterval: 30000,
		staleTime: 15000,
	});
}

export function useAdminServers(page = 1, limit = 25, search = "") {
	return useQuery({
		queryKey: ["admin", "servers", { page, limit, search }],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (search) params.set("search", search);
			const result = await apiGet<
				PaginatedResponse<AdminServer> | { servers: AdminServer[] }
			>(`/admin/servers?${params}`);
			if (!result.success || !result.data) {
				return { servers: [] as AdminServer[], pagination: null };
			}
			const d = result.data;
			if ("items" in d) {
				return { servers: d.items, pagination: d.pagination };
			}
			if ("servers" in d) {
				return { servers: d.servers, pagination: null };
			}
			return { servers: [] as AdminServer[], pagination: null };
		},
		staleTime: 1000 * 60,
	});
}

export function useAdminServerDetail(guildId: string | null) {
	return useQuery({
		queryKey: ["admin", "servers", guildId],
		queryFn: async () => {
			const result = await apiGet<AdminServerDetail>(
				`/admin/servers/${guildId}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useAdminAnalytics(days = 30) {
	return useQuery({
		queryKey: ["admin", "analytics", days],
		queryFn: async () => {
			const result = await apiGet<AdminAnalytics>(
				`/admin/analytics?days=${days}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
	});
}

export function useAdminHealth() {
	return useQuery({
		queryKey: ["admin", "health"],
		queryFn: async () => {
			const result = await apiGet<AdminHealth>("/admin/health");
			if (!result.success || !result.data) return null;
			return result.data;
		},
		refetchInterval: 15000,
		staleTime: 10000,
	});
}
