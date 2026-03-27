import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError, unwrapArray } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type { MemoryChannelConfig, MemoryItem, MemoryTag, MemoryTagGroup } from "@/types/memory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Channel Configs ---

export function useMemoryConfigs(guildId: string) {
	return useQuery({
		queryKey: ["memory", "configs", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/memory/configs`);
			return unwrapArray<MemoryChannelConfig>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useMemoryConfig(guildId: string, configId: string | null) {
	return useQuery({
		queryKey: ["memory", "configs", guildId, configId],
		queryFn: async () => {
			const result = await apiGet<MemoryChannelConfig>(
				`/guilds/${guildId}/memory/configs/${configId}`,
			);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId && !!configId,
	});
}

export function useCreateMemoryConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			forumChannelId: string;
			channelName: string;
		}) => {
			const result = await apiPost<MemoryChannelConfig>(`/guilds/${guildId}/memory/configs`, data);
			return throwOnApiError(result, "Failed to create memory channel");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "configs", guildId],
			});
			toast.success("Memory channel created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateMemoryConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			configId,
			...data
		}: {
			configId: string;
			channelName?: string;
			forumChannelId?: string;
		}) => {
			const result = await apiPut<MemoryChannelConfig>(
				`/guilds/${guildId}/memory/configs/${configId}`,
				data,
			);
			return throwOnApiError(result, "Failed to update memory channel");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "configs", guildId],
			});
			toast.success("Memory channel updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteMemoryConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (configId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/memory/configs/${configId}`);
			throwOnApiError(result, "Failed to delete memory channel");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "configs", guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["memory", "items", guildId] });
			toast.success("Memory channel deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Tags ---

export function useMemoryTags(guildId: string, configId: string | null) {
	return useQuery({
		queryKey: ["memory", "tags", guildId, configId],
		queryFn: async () => {
			const result = await apiGet<MemoryTagGroup | { tags: MemoryTag[] }>(
				`/guilds/${guildId}/memory/configs/${configId}/tags`,
			);
			if (!result.success || !result.data) {
				return { categories: [], statuses: [] } as MemoryTagGroup;
			}
			const d = result.data;
			// Handle both { categories, statuses } and { tags: [...] } shapes
			if ("tags" in d && Array.isArray(d.tags)) {
				return {
					categories: d.tags.filter((t: MemoryTag) => t.tagType === "category"),
					statuses: d.tags.filter((t: MemoryTag) => t.tagType === "status"),
				} as MemoryTagGroup;
			}
			return {
				categories: (d as MemoryTagGroup).categories ?? [],
				statuses: (d as MemoryTagGroup).statuses ?? [],
			};
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId && !!configId,
	});
}

export function useCreateMemoryTag(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			configId,
			...data
		}: {
			configId: string;
			name: string;
			emoji?: string;
			tagType: "category" | "status";
			isDefault?: boolean;
		}) => {
			const result = await apiPost<MemoryTag>(
				`/guilds/${guildId}/memory/configs/${configId}/tags`,
				data,
			);
			return throwOnApiError(result, "Failed to create tag");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "tags", guildId, variables.configId],
			});
			toast.success("Tag created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateMemoryTag(guildId: string, configId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			tagId,
			...data
		}: {
			tagId: string;
			name?: string;
			emoji?: string | null;
		}) => {
			const result = await apiPut<MemoryTag>(`/guilds/${guildId}/memory/tags/${tagId}`, data);
			return throwOnApiError(result, "Failed to update tag");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "tags", guildId, configId],
			});
			toast.success("Tag updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteMemoryTag(guildId: string, configId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tagId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/memory/tags/${tagId}`);
			throwOnApiError(result, "Failed to delete tag");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["memory", "tags", guildId, configId],
			});
			toast.success("Tag deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Items ---

interface MemoryItemParams {
	configId?: string;
	page?: number;
	limit?: number;
	status?: string;
	search?: string;
}

export function useMemoryItems(guildId: string, params: MemoryItemParams = {}) {
	const { configId, page = 1, limit = 20, status, search } = params;

	return useQuery({
		queryKey: ["memory", "items", guildId, { configId, page, limit, status, search }],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (configId) searchParams.set("configId", configId);
			if (status) searchParams.set("status", status);
			if (search) searchParams.set("search", search);

			const result = await apiGet<PaginatedResponse<MemoryItem>>(
				`/guilds/${guildId}/memory/items?${searchParams}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as MemoryItem[],
					pagination: { page, limit, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useMemoryItem(guildId: string, itemId: string | null) {
	return useQuery({
		queryKey: ["memory", "items", guildId, itemId],
		queryFn: async () => {
			const result = await apiGet<MemoryItem>(`/guilds/${guildId}/memory/items/${itemId}`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId && !!itemId,
	});
}

export function useCreateMemoryItem(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			memoryConfigId: string;
			title: string;
			description?: string;
			categoryTag?: string;
			statusTag?: string;
		}) => {
			const result = await apiPost<MemoryItem>(`/guilds/${guildId}/memory/items`, data);
			return throwOnApiError(result, "Failed to create memory item");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memory", "items", guildId] });
			queryClient.invalidateQueries({
				queryKey: ["memory", "configs", guildId],
			});
			toast.success("Memory item created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateMemoryItem(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			itemId,
			...data
		}: {
			itemId: string;
			title?: string;
			description?: string | null;
		}) => {
			const result = await apiPut<MemoryItem>(`/guilds/${guildId}/memory/items/${itemId}`, data);
			return throwOnApiError(result, "Failed to update memory item");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memory", "items", guildId] });
			toast.success("Memory item updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateMemoryItemStatus(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			itemId,
			statusTag,
		}: {
			itemId: string;
			statusTag: string;
		}) => {
			const result = await apiPut<MemoryItem>(`/guilds/${guildId}/memory/items/${itemId}/status`, {
				statusTag,
			});
			return throwOnApiError(result, "Failed to update status");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memory", "items", guildId] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
