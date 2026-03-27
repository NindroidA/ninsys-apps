import { apiGet, apiPost, clearCsrfToken } from "@/lib/api";
import type { DiscordUser } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data: user,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const result = await apiGet<DiscordUser>("/auth/me");
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		retry: false,
		refetchOnWindowFocus: true,
	});

	const logout = useCallback(async () => {
		try {
			await apiPost("/auth/logout");
		} finally {
			clearCsrfToken();
			queryClient.clear();
			navigate("/");
		}
	}, [queryClient, navigate]);

	return {
		user: user ?? null,
		isLoading,
		isAuthenticated: !!user,
		isOwner: user?.isOwner ?? false,
		error,
		logout,
		refetch,
	};
}
