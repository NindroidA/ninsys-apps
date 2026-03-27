import { apiDelete, apiGet, apiPost, apiPut, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { RoleType, SavedRole } from "@/types/roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSavedRoles(guildId: string) {
	return useQuery({
		queryKey: ["roles", guildId],
		queryFn: async () => {
			const result = await apiGet<{ staff: SavedRole[]; admin: SavedRole[] }>(
				`/guilds/${guildId}/roles`,
			);
			if (!result.success || !result.data) return [];
			return [...(result.data.staff ?? []), ...(result.data.admin ?? [])];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useAddRole(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			role: string;
			type: RoleType;
			alias?: string;
		}) => {
			const result = await apiPost<SavedRole>(`/guilds/${guildId}/roles`, data);
			return throwOnApiError(result, "Failed to add role");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles", guildId] });
			toast.success("Role added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useUpdateRole(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, alias }: { id: number; alias: string | null }) => {
			const result = await apiPut<SavedRole>(`/guilds/${guildId}/roles/${id}`, {
				alias,
			});
			return throwOnApiError(result, "Failed to update role");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles", guildId] });
			toast.success("Role updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteRole(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (roleId: number) => {
			const result = await apiDelete(`/guilds/${guildId}/roles/${roleId}`);
			throwOnApiError(result, "Failed to delete role");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles", guildId] });
			toast.success("Role removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
