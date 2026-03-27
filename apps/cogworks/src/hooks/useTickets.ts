import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError, unwrapArray } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type {
	CustomField,
	CustomTicketType,
	Ticket,
	TicketConfig,
	UserTicketRestriction,
} from "@/types/tickets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config ---

export function useTicketConfig(guildId: string) {
	return useQuery({
		queryKey: ["tickets", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<{
				config: TicketConfig;
				archivedConfig: unknown;
			}>(`/guilds/${guildId}/tickets/config`);
			if (!result.success || !result.data) return null;
			return result.data.config ?? null;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateTicketConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (config: Partial<TicketConfig>) => {
			const result = await apiPut<TicketConfig>(`/guilds/${guildId}/tickets/config`, config);
			return throwOnApiError(result, "Failed to update ticket config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "config", guildId],
			});
			toast.success("Ticket configuration saved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Types ---

export function useTicketTypes(guildId: string) {
	return useQuery({
		queryKey: ["tickets", "types", guildId],
		queryFn: async () => {
			const result = await apiGet<{
				types?: CustomTicketType[];
				customTypes?: CustomTicketType[];
			}>(`/guilds/${guildId}/tickets/types`);
			if (!result.success || !result.data) return [];
			return result.data.types ?? result.data.customTypes ?? [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useCreateTicketType(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			displayName: string;
			emoji?: string;
			embedColor?: string;
			description?: string;
			isDefault?: boolean;
			isActive?: boolean;
			pingStaffOnCreate?: boolean;
			customFields?: CustomField[];
		}) => {
			const result = await apiPost<CustomTicketType>(`/guilds/${guildId}/tickets/types`, data);
			return throwOnApiError(result, "Failed to create ticket type");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "types", guildId],
			});
			toast.success("Ticket type created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateTicketType(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			typeId,
			...data
		}: {
			typeId: string;
			displayName?: string;
			emoji?: string | null;
			embedColor?: string | null;
			description?: string | null;
			isDefault?: boolean;
			isActive?: boolean;
			pingStaffOnCreate?: boolean;
		}) => {
			const result = await apiPut<CustomTicketType>(
				`/guilds/${guildId}/tickets/types/${typeId}`,
				data,
			);
			return throwOnApiError(result, "Failed to update ticket type");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "types", guildId],
			});
			toast.success("Ticket type updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteTicketType(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (typeId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/tickets/types/${typeId}`);
			throwOnApiError(result, "Failed to delete ticket type");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "types", guildId],
			});
			toast.success("Ticket type deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateTicketTypeFields(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			typeId,
			customFields,
		}: {
			typeId: string;
			customFields: CustomField[];
		}) => {
			const result = await apiPut<CustomTicketType>(
				`/guilds/${guildId}/tickets/types/${typeId}/fields`,
				{ customFields },
			);
			return throwOnApiError(result, "Failed to update fields");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "types", guildId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useReorderTicketTypes(guildId: string) {
	const queryClient = useQueryClient();
	const queryKey = ["tickets", "types", guildId];

	return useMutation({
		mutationFn: async (orderedTypeIds: string[]) => {
			const result = await apiPut(`/guilds/${guildId}/tickets/types/reorder`, {
				orderedTypeIds,
			});
			throwOnApiError(result, "Failed to reorder types");
		},
		onMutate: async (orderedTypeIds: string[]) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<CustomTicketType[]>(queryKey);
			if (previous) {
				const reordered = orderedTypeIds
					.map((typeId, i) => {
						const type = previous.find((t) => t.typeId === typeId);
						return type ? { ...type, sortOrder: i } : null;
					})
					.filter((t): t is CustomTicketType => t !== null);
				queryClient.setQueryData(queryKey, reordered);
			}
			return { previous };
		},
		onError: (error: Error, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.error(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
}

// --- Restrictions ---

export function useTicketRestrictions(guildId: string) {
	return useQuery({
		queryKey: ["tickets", "restrictions", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/tickets/restrictions`);
			return unwrapArray<UserTicketRestriction>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useAddRestriction(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			userId: string;
			typeId: string | null;
			reason: string;
		}) => {
			const result = await apiPost<UserTicketRestriction>(
				`/guilds/${guildId}/tickets/restrictions`,
				data,
			);
			return throwOnApiError(result, "Failed to add restriction");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "restrictions", guildId],
			});
			toast.success("Restriction added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useRemoveRestriction(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (restrictionId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/tickets/restrictions/${restrictionId}`);
			throwOnApiError(result, "Failed to remove restriction");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "restrictions", guildId],
			});
			toast.success("Restriction removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Active Tickets ---

interface ActiveTicketParams {
	page?: number;
	limit?: number;
	status?: "open" | "closed" | "all";
}

export function useActiveTickets(guildId: string, params: ActiveTicketParams = {}) {
	const { page = 1, limit = 20, status = "all" } = params;

	return useQuery({
		queryKey: ["tickets", "active", guildId, { page, limit, status }],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (status !== "all") searchParams.set("status", status);

			const result = await apiGet<PaginatedResponse<Ticket>>(
				`/guilds/${guildId}/tickets/active?${searchParams}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as Ticket[],
					pagination: { page, limit, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useTicketDetail(guildId: string, ticketId: string | null) {
	return useQuery({
		queryKey: ["tickets", "detail", guildId, ticketId],
		queryFn: async () => {
			const result = await apiGet<Ticket>(`/guilds/${guildId}/tickets/${ticketId}`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId && !!ticketId,
	});
}

export function useCloseTicket(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			ticketId,
			reason,
		}: {
			ticketId: string;
			reason?: string;
		}) => {
			const result = await apiPost(`/guilds/${guildId}/tickets/${ticketId}/close`, { reason });
			throwOnApiError(result, "Failed to close ticket");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "active", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["tickets", "detail", guildId],
			});
			toast.success("Ticket closed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useAssignTicket(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			ticketId,
			userId,
		}: {
			ticketId: string;
			userId: string;
		}) => {
			const result = await apiPost(`/guilds/${guildId}/tickets/${ticketId}/assign`, { userId });
			throwOnApiError(result, "Failed to assign ticket");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", "active", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["tickets", "detail", guildId],
			});
			toast.success("Ticket assigned");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
