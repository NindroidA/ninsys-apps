import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { EventTemplate, EventsConfig, UpcomingReminder } from "@/types/events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEventsConfig(guildId: string) {
	return useQuery({
		queryKey: ["events", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<EventsConfig>(`/guilds/${guildId}/events/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateEventsConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<EventsConfig>) => {
			const result = await apiPost<EventsConfig>(`/guilds/${guildId}/events/config/update`, data);
			return throwOnApiError(result, "Failed to update events config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["events", "config", guildId],
			});
			toast.success("Event settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useEventTemplates(guildId: string) {
	return useQuery({
		queryKey: ["events", "templates", guildId],
		queryFn: async () => {
			const result = await apiGet<EventTemplate[]>(`/guilds/${guildId}/events/templates`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useCreateEventTemplate(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Omit<EventTemplate, "id" | "createdAt">) => {
			const result = await apiPost<EventTemplate>(
				`/guilds/${guildId}/events/templates/create`,
				data,
			);
			return throwOnApiError(result, "Failed to create template");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["events", "templates", guildId],
			});
			toast.success("Event template created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteEventTemplate(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (templateId: string) => {
			const result = await apiPost(`/guilds/${guildId}/events/templates/delete`, { templateId });
			return throwOnApiError(result, "Failed to delete template");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["events", "templates", guildId],
			});
			toast.success("Event template deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpcomingReminders(guildId: string) {
	return useQuery({
		queryKey: ["events", "reminders", guildId],
		queryFn: async () => {
			const result = await apiGet<UpcomingReminder[]>(`/guilds/${guildId}/events/reminders`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60 * 2,
		enabled: !!guildId,
	});
}
