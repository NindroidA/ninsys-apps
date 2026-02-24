/**
 * Two-Factor Authentication hooks
 */

import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Setup2FAResponse {
	qrCodeDataUrl: string;
	otpauthUrl: string;
	secret: string;
}

export interface Confirm2FAResponse {
	recoveryCodes: string[];
}

export function useSetup2FA() {
	return useMutation({
		mutationFn: async () => {
			const res = await api.post<Setup2FAResponse>("/v2/pluginator/account/2fa/setup", {});
			if (!res.success || !res.data) {
				throw new Error(res.error || "Failed to set up 2FA");
			}
			return res.data;
		},
	});
}

export function useConfirm2FA() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { secret: string; code: string }) => {
			const res = await api.post<Confirm2FAResponse>("/v2/pluginator/account/2fa/confirm", data);
			if (!res.success || !res.data) {
				throw new Error(res.error || "Failed to confirm 2FA");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
		},
	});
}

export function useDisable2FA() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { code: string }) => {
			const res = await api.post("/v2/pluginator/account/2fa/disable", data);
			if (!res.success) {
				throw new Error(res.error || "Failed to disable 2FA");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
		},
	});
}
