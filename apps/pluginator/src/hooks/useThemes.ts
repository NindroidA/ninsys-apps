/**
 * Theme Registry Hooks
 *
 * React Query hooks for fetching theme data from the NinSys API.
 */

import { fetchJson } from "@/lib/api";
import type {
	RegistryTheme,
	ThemeCategoryInfo,
	ThemeFilters,
	ThemePagination,
} from "@/types/theme";
import { useQuery } from "@tanstack/react-query";

// =============================================================================
// Query Keys
// =============================================================================

export const themeKeys = {
	all: ["themes"] as const,
	lists: () => [...themeKeys.all, "list"] as const,
	list: (filters: ThemeFilters, page: number, limit: number) =>
		[...themeKeys.lists(), { filters, page, limit }] as const,
	details: () => [...themeKeys.all, "detail"] as const,
	detail: (id: string) => [...themeKeys.details(), id] as const,
	categories: () => [...themeKeys.all, "categories"] as const,
	featured: (limit: number) => [...themeKeys.all, "featured", limit] as const,
};

// =============================================================================
// Hooks
// =============================================================================

interface UseRegistryThemesOptions {
	filters?: ThemeFilters;
	page?: number;
	limit?: number;
}

interface UseRegistryThemesResult {
	themes: RegistryTheme[];
	pagination: ThemePagination;
}

/**
 * Fetch paginated list of themes with filters
 */
export function useRegistryThemes(options: UseRegistryThemesOptions = {}) {
	const { filters = {}, page = 1, limit = 18 } = options;

	return useQuery({
		queryKey: themeKeys.list(filters, page, limit),
		queryFn: async (): Promise<UseRegistryThemesResult> => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (filters.search) params.set("search", filters.search);
			if (filters.type) params.set("type", filters.type);
			if (filters.category) params.set("category", filters.category);
			if (filters.tier) params.set("tier", filters.tier);
			if (filters.sort) params.set("sort", filters.sort);

			const data = await fetchJson<{
				success: boolean;
				themes: RegistryTheme[];
				pagination: ThemePagination;
			}>(`/v2/pluginator/themes?${params}`);

			return {
				themes: data.themes,
				pagination: data.pagination,
			};
		},
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Fetch a single theme by ID
 */
export function useRegistryTheme(id: string) {
	return useQuery({
		queryKey: themeKeys.detail(id),
		queryFn: async (): Promise<RegistryTheme | null> => {
			try {
				const data = await fetchJson<{
					success: boolean;
					data: RegistryTheme;
				}>(`/v2/pluginator/themes/${id}`);
				return data.data;
			} catch {
				return null;
			}
		},
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Fetch theme categories with counts
 */
export function useThemeCategories() {
	return useQuery({
		queryKey: themeKeys.categories(),
		queryFn: async (): Promise<ThemeCategoryInfo[]> => {
			const data = await fetchJson<{
				success: boolean;
				categories: ThemeCategoryInfo[];
			}>("/v2/pluginator/themes/categories");
			return data.categories;
		},
		staleTime: 10 * 60 * 1000,
	});
}

/**
 * Fetch featured themes
 */
export function useFeaturedThemes(limit = 6) {
	return useQuery({
		queryKey: themeKeys.featured(limit),
		queryFn: async (): Promise<RegistryTheme[]> => {
			const data = await fetchJson<{
				success: boolean;
				themes: RegistryTheme[];
			}>(`/v2/pluginator/themes/featured?limit=${limit}`);
			return data.themes;
		},
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * Search themes with debounced query
 */
export function useThemeSearch(query: string, enabled = true) {
	return useQuery({
		queryKey: [...themeKeys.lists(), "search", query],
		queryFn: async (): Promise<RegistryTheme[]> => {
			if (!query.trim()) return [];

			const data = await fetchJson<{
				success: boolean;
				results: RegistryTheme[];
			}>(`/v2/pluginator/themes/search?q=${encodeURIComponent(query)}`);
			return data.results;
		},
		enabled: enabled && query.length >= 2,
		staleTime: 30 * 1000,
	});
}
