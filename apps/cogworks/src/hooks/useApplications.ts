import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError, unwrapArray } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { PaginatedResponse } from "@/types/api";
import type { Application, ApplicationConfig, Position } from "@/types/applications";
import type { CustomField } from "@/types/tickets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Config ---

export function useApplicationConfig(guildId: string) {
	return useQuery({
		queryKey: ["applications", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<{
				config: ApplicationConfig;
				archivedConfig: unknown;
			}>(`/guilds/${guildId}/applications/config`);
			if (!result.success || !result.data) return null;
			return result.data.config ?? null;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateApplicationConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (config: Partial<ApplicationConfig>) => {
			const result = await apiPut<ApplicationConfig>(
				`/guilds/${guildId}/applications/config`,
				config,
			);
			return throwOnApiError(result, "Failed to update application config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "config", guildId],
			});
			toast.success("Application configuration saved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Positions ---

export function usePositions(guildId: string) {
	return useQuery({
		queryKey: ["applications", "positions", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/applications/positions`);
			return unwrapArray<Position>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useCreatePosition(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			title: string;
			description?: string;
			emoji?: string;
			ageGateEnabled?: boolean;
			customFields?: CustomField[];
		}) => {
			const result = await apiPost<Position>(`/guilds/${guildId}/applications/positions`, data);
			return throwOnApiError(result, "Failed to create position");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "positions", guildId],
			});
			toast.success("Position created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdatePosition(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			positionId,
			...data
		}: {
			positionId: string;
			title?: string;
			description?: string | null;
			emoji?: string | null;
			ageGateEnabled?: boolean;
		}) => {
			const result = await apiPut<Position>(
				`/guilds/${guildId}/applications/positions/${positionId}`,
				data,
			);
			return throwOnApiError(result, "Failed to update position");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "positions", guildId],
			});
			toast.success("Position updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeletePosition(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (positionId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/applications/positions/${positionId}`);
			throwOnApiError(result, "Failed to delete position");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "positions", guildId],
			});
			toast.success("Position deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useTogglePosition(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (positionId: string) => {
			const result = await apiPut<Position>(
				`/guilds/${guildId}/applications/positions/${positionId}/toggle`,
			);
			return throwOnApiError(result, "Failed to toggle position");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "positions", guildId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdatePositionFields(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			positionId,
			fields,
		}: {
			positionId: string;
			fields: CustomField[];
		}) => {
			const result = await apiPut<Position>(
				`/guilds/${guildId}/applications/positions/${positionId}/fields`,
				{ fields },
			);
			return throwOnApiError(result, "Failed to update fields");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "positions", guildId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Active Applications ---

interface ActiveApplicationParams {
	page?: number;
	limit?: number;
	status?: "pending" | "approved" | "denied" | "archived" | "all";
	positionId?: string;
}

export function useActiveApplications(guildId: string, params: ActiveApplicationParams = {}) {
	const { page = 1, limit = 20, status = "all", positionId } = params;

	return useQuery({
		queryKey: ["applications", "active", guildId, { page, limit, status, positionId }],
		queryFn: async () => {
			const searchParams = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});
			if (status !== "all") searchParams.set("status", status);
			if (positionId) searchParams.set("positionId", positionId);

			const result = await apiGet<PaginatedResponse<Application>>(
				`/guilds/${guildId}/applications/active?${searchParams}`,
			);
			if (!result.success || !result.data) {
				return {
					data: [] as Application[],
					pagination: { page, limit, total: 0, totalPages: 0 },
				};
			}
			return { data: result.data.items, pagination: result.data.pagination };
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useApproveApplication(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ appId, note }: { appId: string; note?: string }) => {
			const result = await apiPost(`/guilds/${guildId}/applications/${appId}/approve`, { note });
			throwOnApiError(result, "Failed to approve application");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "active", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["applications", "detail", guildId],
			});
			toast.success("Application approved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDenyApplication(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			appId,
			reason,
		}: {
			appId: string;
			reason: string;
		}) => {
			const result = await apiPost(`/guilds/${guildId}/applications/${appId}/deny`, { reason });
			throwOnApiError(result, "Failed to deny application");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "active", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["applications", "detail", guildId],
			});
			toast.success("Application denied");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useArchiveApplication(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (appId: string) => {
			const result = await apiPost(`/guilds/${guildId}/applications/${appId}/archive`);
			throwOnApiError(result, "Failed to archive application");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications", "active", guildId],
			});
			queryClient.invalidateQueries({
				queryKey: ["applications", "detail", guildId],
			});
			toast.success("Application archived");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
