import { apiDelete, apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { BotStatusFull, MaintenanceStatus, StatusLevel } from "@/types/maintenance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Maintenance mode (public, no auth) ---

export function useMaintenanceStatus() {
	return useQuery({
		queryKey: ["maintenance"],
		queryFn: async () => {
			const res = await fetch("/v2/cogworks/maintenance");
			if (!res.ok) return { active: false } as MaintenanceStatus;
			return (await res.json()) as MaintenanceStatus;
		},
		refetchInterval: 60000,
		staleTime: 30000,
	});
}

// --- Full bot status (admin, proxied through API) ---

export function useBotStatusFull() {
	return useQuery({
		queryKey: ["bot-status-full"],
		queryFn: async () => {
			const result = await apiGet<BotStatusFull>("/admin/bot-status");
			if (!result.success || !result.data) return null;
			return result.data;
		},
		refetchInterval: 15000,
		staleTime: 10000,
	});
}

// --- Override controls (admin only) ---

export function useSetStatusOverride() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { message: string; level?: StatusLevel }) => {
			const result = await apiPost<BotStatusFull>("/admin/bot-status/override", data);
			return throwOnApiError(result, "Failed to set status override");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bot-status-full"] });
			queryClient.invalidateQueries({ queryKey: ["maintenance"] });
			toast.success("Status override set");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useClearStatusOverride() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const result = await apiDelete<BotStatusFull>("/admin/bot-status/override");
			return throwOnApiError(result, "Failed to clear status override");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bot-status-full"] });
			queryClient.invalidateQueries({ queryKey: ["maintenance"] });
			toast.success("Status override cleared");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

// --- Maintenance banner message (localStorage, admin-configured) ---

const BANNER_MESSAGE_KEY = "cogworks_maintenance_banner_message";
const DEFAULT_BANNER =
	"Cogworks services are currently undergoing maintenance. We'll be back soon!";

export function getMaintenanceBannerMessage(): string {
	return localStorage.getItem(BANNER_MESSAGE_KEY) ?? DEFAULT_BANNER;
}

export function setMaintenanceBannerMessage(message: string): void {
	localStorage.setItem(BANNER_MESSAGE_KEY, message);
}

// --- Banner dismissal (localStorage, per-user) ---

const DISMISSED_KEY = "cogworks_banner_dismissed";
const DISMISS_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function isBannerDismissed(): boolean {
	const raw = localStorage.getItem(DISMISSED_KEY);
	if (!raw) return false;
	const dismissedAt = Number(raw);
	if (Date.now() - dismissedAt > DISMISS_DURATION_MS) {
		localStorage.removeItem(DISMISSED_KEY);
		return false;
	}
	return true;
}

export function dismissBanner(): void {
	localStorage.setItem(DISMISSED_KEY, String(Date.now()));
}

// --- Global announcement (localStorage, admin-configured, independent of maintenance) ---

const ANNOUNCEMENT_KEY = "cogworks_global_announcement";
const ANNOUNCEMENT_DISMISSED_KEY = "cogworks_announcement_dismissed";

export interface GlobalAnnouncement {
	message: string;
	type: "info" | "warning" | "success";
	setAt: number;
}

export function getGlobalAnnouncement(): GlobalAnnouncement | null {
	const raw = localStorage.getItem(ANNOUNCEMENT_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as GlobalAnnouncement;
	} catch {
		return null;
	}
}

export function setGlobalAnnouncement(
	message: string,
	type: "info" | "warning" | "success" = "info",
): void {
	localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify({ message, type, setAt: Date.now() }));
	// Clear any existing dismissal so the new announcement shows immediately
	localStorage.removeItem(ANNOUNCEMENT_DISMISSED_KEY);
}

export function clearGlobalAnnouncement(): void {
	localStorage.removeItem(ANNOUNCEMENT_KEY);
	localStorage.removeItem(ANNOUNCEMENT_DISMISSED_KEY);
}

export function isAnnouncementDismissed(): boolean {
	const announcement = getGlobalAnnouncement();
	if (!announcement) return false;
	const raw = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
	if (!raw) return false;
	const dismissedAt = Number(raw);
	// Stay dismissed for 4 hours
	if (Date.now() - dismissedAt > 4 * 60 * 60 * 1000) {
		localStorage.removeItem(ANNOUNCEMENT_DISMISSED_KEY);
		return false;
	}
	return true;
}

export function dismissAnnouncement(): void {
	localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, String(Date.now()));
}
