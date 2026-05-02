/**
 * Permission management hooks (v3.1.3)
 */

import { apiDelete, apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type {
	PermissionsResponse,
	UpsertPermissionInput,
	UpsertPermissionResponse,
} from "@/types/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePermissions(guildId: string) {
	return useQuery({
		queryKey: ["permissions", guildId],
		queryFn: async () => {
			const result = await apiGet<PermissionsResponse>(`/guilds/${guildId}/permissions`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60,
		enabled: !!guildId,
	});
}

export function useUpsertPermission(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: UpsertPermissionInput) => {
			const result = await apiPost<UpsertPermissionResponse>(
				`/guilds/${guildId}/permissions`,
				input,
			);
			return throwOnApiError(result, "Failed to save permission");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["permissions", guildId] });
			toast.success("Permission saved");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeletePermission(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (permissionId: number) => {
			const result = await apiDelete(`/guilds/${guildId}/permissions/${permissionId}`);
			return throwOnApiError(result, "Failed to delete permission");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["permissions", guildId] });
			toast.success("Permission removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}
