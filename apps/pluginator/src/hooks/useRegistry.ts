/**
 * Plugin Registry Hooks
 *
 * React Query hooks for fetching registry data from the NinSys API.
 */

import { fetchJson } from "@/lib/api";
import { CATEGORY_INFO } from "@/types/registry";
import type {
	CategoryInfo,
	RegistryFilters,
	RegistryPagination,
	RegistryPlugin,
} from "@/types/registry";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch paginated and filtered plugins
 */
export function useRegistryPlugins(options?: {
	filters?: RegistryFilters;
	page?: number;
	limit?: number;
}) {
	const { filters = {}, page = 1, limit = 20 } = options || {};

	return useQuery<{
		plugins: RegistryPlugin[];
		pagination: RegistryPagination;
	}>({
		queryKey: ["registry", "plugins", filters, page, limit],
		queryFn: async () => {
			// If there's a search query, use the search endpoint
			if (filters.search?.trim()) {
				const params = new URLSearchParams({
					q: filters.search,
					limit: String(limit),
				});
				if (filters.category) params.set("category", filters.category);

				const data = await fetchJson<{
					success: boolean;
					plugins: RegistryPlugin[];
					total: number;
				}>(`/v2/pluginator/registry/search?${params}`);

				return {
					plugins: data.plugins,
					pagination: {
						page: 1,
						limit,
						total: data.total,
						totalPages: Math.ceil(data.total / limit),
						hasMore: data.total > limit,
					},
				};
			}

			// Otherwise use the list endpoint with filters
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (filters.category) params.set("category", filters.category);
			if (filters.sort) params.set("sort", filters.sort);
			if (filters.sortOrder) params.set("order", filters.sortOrder);
			if (filters.verified) params.set("verified", "true");
			if (filters.popular) params.set("popular", "true");

			const data = await fetchJson<{
				success: boolean;
				plugins: RegistryPlugin[];
				pagination: RegistryPagination;
			}>(`/v2/pluginator/registry?${params}`);

			return {
				plugins: data.plugins,
				pagination: data.pagination,
			};
		},
		staleTime: 1000 * 60 * 5,
	});
}

/**
 * Hook to fetch a single plugin by ID
 */
export function useRegistryPlugin(id: string) {
	return useQuery<RegistryPlugin | null>({
		queryKey: ["registry", "plugin", id],
		queryFn: async () => {
			try {
				const data = await fetchJson<{
					success: boolean;
					data: RegistryPlugin;
				}>(`/v2/pluginator/registry/${id}`);
				return data.data;
			} catch {
				return null;
			}
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!id,
	});
}

/**
 * Hook to fetch categories with plugin counts
 */
export function useRegistryCategories() {
	return useQuery<CategoryInfo[]>({
		queryKey: ["registry", "categories"],
		queryFn: async () => {
			const data = await fetchJson<{
				success: boolean;
				categories: { id: string; name: string; count: number }[];
			}>("/v2/pluginator/registry/categories");

			// Map API response to frontend CategoryInfo (API returns emoji icon, we use iconKey)
			return data.categories.map(
				(cat): CategoryInfo => ({
					id: cat.id as CategoryInfo["id"],
					name: cat.name,
					iconKey: CATEGORY_INFO[cat.id as keyof typeof CATEGORY_INFO]?.iconKey ?? cat.id,
					count: cat.count,
				}),
			);
		},
		staleTime: 1000 * 60 * 10,
	});
}

/**
 * Hook to fetch featured/popular plugins
 */
export function useFeaturedPlugins(limit = 6) {
	return useQuery<RegistryPlugin[]>({
		queryKey: ["registry", "featured", limit],
		queryFn: async () => {
			const data = await fetchJson<{
				success: boolean;
				plugins: RegistryPlugin[];
			}>(`/v2/pluginator/registry/popular?limit=${limit}`);
			return data.plugins;
		},
		staleTime: 1000 * 60 * 5,
	});
}

/**
 * Hook to get available Minecraft versions for filtering
 */
export function useMinecraftVersions() {
	return useQuery<string[]>({
		queryKey: ["registry", "mc-versions"],
		queryFn: async () => {
			// Static version list — no API endpoint for this yet
			return [
				"1.21.4",
				"1.21.3",
				"1.21.2",
				"1.21.1",
				"1.21",
				"1.20.6",
				"1.20.4",
				"1.20.2",
				"1.20.1",
				"1.20",
				"1.19.4",
				"1.19.3",
				"1.19.2",
				"1.19.1",
				"1.19",
				"1.18.2",
				"1.18.1",
				"1.18",
				"1.17.1",
				"1.17",
				"1.16.5",
				"1.16.4",
				"1.16.3",
				"1.16.2",
				"1.16.1",
				"1.15.2",
				"1.14.4",
				"1.13.2",
				"1.12.2",
				"1.8.8",
			];
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

/**
 * Hook to search plugins with a query string
 */
export function usePluginSearch(query: string, options?: { limit?: number }) {
	const { limit = 20 } = options || {};

	return useRegistryPlugins({
		filters: { search: query },
		page: 1,
		limit,
	});
}
