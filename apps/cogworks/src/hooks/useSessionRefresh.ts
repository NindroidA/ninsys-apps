import { apiPost, clearCsrfToken } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes

export function useSessionRefresh(isAuthenticated: boolean) {
	const queryClient = useQueryClient();
	const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

	useEffect(() => {
		if (!isAuthenticated) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			return;
		}

		intervalRef.current = setInterval(async () => {
			try {
				const result = await apiPost("/auth/refresh");
				if (!result.success) {
					clearCsrfToken();
					queryClient.clear();
					window.location.href = "/login";
				}
			} catch {
				clearCsrfToken();
				queryClient.clear();
				window.location.href = "/login";
			}
		}, REFRESH_INTERVAL);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isAuthenticated, queryClient]);
}
