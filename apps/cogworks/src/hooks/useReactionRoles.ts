import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError, unwrapArray } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { ReactionRoleMenu, ReactionRoleMode } from "@/types/reaction-roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Menus ---

export function useReactionRoleMenus(guildId: string) {
	return useQuery({
		queryKey: ["reaction-roles", guildId],
		queryFn: async () => {
			const result = await apiGet(`/guilds/${guildId}/reaction-roles`);
			return unwrapArray<ReactionRoleMenu>(result);
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useReactionRoleMenu(guildId: string, menuId: string | null) {
	return useQuery({
		queryKey: ["reaction-roles", guildId, menuId],
		queryFn: async () => {
			const result = await apiGet<ReactionRoleMenu>(`/guilds/${guildId}/reaction-roles/${menuId}`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId && !!menuId,
	});
}

export function useCreateReactionRoleMenu(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			name: string;
			description?: string;
			channelId?: string;
			mode: ReactionRoleMode;
		}) => {
			const result = await apiPost<ReactionRoleMenu>(`/guilds/${guildId}/reaction-roles`, data);
			return throwOnApiError(result, "Failed to create menu");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			toast.success("Reaction role menu created");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateReactionRoleMenu(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			menuId,
			...data
		}: {
			menuId: string;
			name?: string;
			description?: string | null;
			channelId?: string | null;
			mode?: ReactionRoleMode;
		}) => {
			const result = await apiPut<ReactionRoleMenu>(
				`/guilds/${guildId}/reaction-roles/${menuId}`,
				data,
			);
			return throwOnApiError(result, "Failed to update menu");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			queryClient.invalidateQueries({
				queryKey: ["reaction-roles", guildId, variables.menuId],
			});
			toast.success("Menu updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteReactionRoleMenu(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (menuId: string) => {
			const result = await apiDelete(`/guilds/${guildId}/reaction-roles/${menuId}`);
			throwOnApiError(result, "Failed to delete menu");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			toast.success("Menu deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Options ---

export function useAddReactionRoleOption(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			menuId: string;
			emoji: string;
			roleId: string;
			description?: string;
		}) => {
			const { menuId, ...payload } = data;
			const result = await apiPost(`/guilds/${guildId}/reaction-roles/${menuId}/options`, payload);
			return throwOnApiError(result, "Failed to add option");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["reaction-roles", guildId, variables.menuId],
			});
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			toast.success("Option added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateReactionRoleOption(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			menuId,
			optionId,
			...data
		}: {
			menuId: string;
			optionId: string;
			emoji?: string;
			roleId?: string;
			description?: string | null;
		}) => {
			const result = await apiPut(
				`/guilds/${guildId}/reaction-roles/${menuId}/options/${optionId}`,
				data,
			);
			return throwOnApiError(result, "Failed to update option");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["reaction-roles", guildId, variables.menuId],
			});
			toast.success("Option updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteReactionRoleOption(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			menuId,
			optionId,
		}: {
			menuId: string;
			optionId: string;
		}) => {
			const result = await apiDelete(
				`/guilds/${guildId}/reaction-roles/${menuId}/options/${optionId}`,
			);
			throwOnApiError(result, "Failed to delete option");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["reaction-roles", guildId, variables.menuId],
			});
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			toast.success("Option removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useReorderReactionRoleOptions(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			menuId,
			optionIds,
		}: {
			menuId: string;
			optionIds: string[];
		}) => {
			const result = await apiPut(`/guilds/${guildId}/reaction-roles/${menuId}/options/reorder`, {
				optionIds,
			});
			throwOnApiError(result, "Failed to reorder options");
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["reaction-roles", guildId, variables.menuId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Actions ---

export function useValidateMenu(guildId: string) {
	return useMutation({
		mutationFn: async (menuId: string) => {
			const result = await apiPost<{ valid: boolean; issues: string[] }>(
				`/guilds/${guildId}/reaction-roles/${menuId}/validate`,
				{},
			);
			return throwOnApiError(result, "Validation failed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useRebuildMenu(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (menuId: string) => {
			const result = await apiPost(`/guilds/${guildId}/reaction-roles/${menuId}/rebuild`, {});
			throwOnApiError(result, "Failed to rebuild menu");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reaction-roles", guildId] });
			toast.success("Menu rebuilt successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
