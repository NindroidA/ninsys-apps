import { apiPost } from "@/lib/api";
import { useEffect, useRef } from "react";

const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes

/**
 * Keeps the session alive by calling /auth/refresh every 30 minutes.
 *
 * Only a real 401 ends the session, and handleResponse already clears the CSRF
 * token and redirects to /login for that. Anything else (429, 5xx, a network
 * error, a CSRF blip) is transient: the user stays on the page with their
 * unsaved edits, and the next tick tries again.
 */
export function useSessionRefresh(isAuthenticated: boolean) {
	const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

	useEffect(() => {
		if (!isAuthenticated) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			return;
		}

		intervalRef.current = setInterval(async () => {
			try {
				await apiPost("/auth/refresh");
			} catch {
				// Network error: not a sign the session ended. Retry on the next tick.
			}
		}, REFRESH_INTERVAL);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isAuthenticated]);
}
