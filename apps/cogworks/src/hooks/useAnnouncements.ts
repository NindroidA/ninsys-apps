import { apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type {
	AnnouncementConfig,
	AnnouncementLog,
	AnnouncementPayload,
	AnnouncementTemplate,
} from "@/types/announcements";
import type { PaginatedResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config ---

export function useAnnouncementConfig(guildId: string) {
	return useQuery({
		queryKey: ["announcements", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<AnnouncementConfig>(`/guilds/${guildId}/announcements/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateAnnouncementConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (config: Partial<AnnouncementConfig>) => {
			const result = await apiPut<AnnouncementConfig>(
				`/guilds/${guildId}/announcements/config`,
				config,
			);
			return throwOnApiError(result, "Failed to update announcement config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements", "config", guildId],
			});
			toast.success("Announcement configuration saved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Send ---

export function useSendAnnouncement(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: AnnouncementPayload) => {
			const result = await apiPost(`/guilds/${guildId}/announcements/send`, payload);
			return throwOnApiError(result, "Failed to send announcement");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements", "history", guildId],
			});
			toast.success("Announcement sent!");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- History ---

interface AnnouncementHistoryParams {
	page?: number;
	limit?: number;
}

export function useAnnouncementHistory(guildId: string, params: AnnouncementHistoryParams = {}) {
	const { page = 1, limit = 20 } = params;

	return useQuery({
		queryKey: ["announcements", "history", guildId, { page, limit }],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});

			const result = await apiGet<PaginatedResponse<AnnouncementLog>>(
				`/guilds/${guildId}/announcements/history?${searchParams}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as AnnouncementLog[],
					pagination: { page, limit, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

// --- Templates ---

export function useAnnouncementTemplates(guildId: string) {
	return useQuery({
		queryKey: ["announcements", "templates", guildId],
		queryFn: async () => {
			const result = await apiGet<AnnouncementTemplate[] | { templates: AnnouncementTemplate[] }>(
				`/guilds/${guildId}/announcements/templates`,
			);
			if (!result.success || !result.data) return [];
			const raw = result.data;
			return Array.isArray(raw) ? raw : (raw.templates ?? []);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useCreateAnnouncementTemplate(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: Omit<
				AnnouncementTemplate,
				"id" | "guildId" | "isDefault" | "createdBy" | "createdAt" | "updatedAt"
			>,
		) => {
			const result = await apiPost<AnnouncementTemplate>(
				`/guilds/${guildId}/announcements/templates`,
				data,
			);
			return throwOnApiError(result, "Failed to create template");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements", "templates", guildId],
			});
			toast.success("Template created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteAnnouncementTemplate(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (templateName: string) => {
			const result = await apiPost(`/guilds/${guildId}/announcements/templates/delete`, {
				name: templateName,
			});
			return throwOnApiError(result, "Failed to delete template");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements", "templates", guildId],
			});
			toast.success("Template deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
