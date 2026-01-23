/**
 * Subscription API hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SubscriptionInfo, Tier } from "@/types/tier";

interface CheckoutResponse {
	url: string;
}

interface PortalResponse {
	url: string;
}

export function useSubscription() {
	return useQuery<SubscriptionInfo | null>({
		queryKey: ["subscription"],
		queryFn: async () => {
			const res = await api.get<SubscriptionInfo>("/v2/pluginator/subscription");
			if (!res.success) return null;
			return res.data ?? null;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: false,
	});
}

export function useCreateCheckout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tier: Tier) => {
			const res = await api.post<CheckoutResponse>("/v2/pluginator/checkout", { tier });
			if (!res.success || !res.data) {
				throw new Error(res.error || "Failed to create checkout session");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription"] });
		},
	});
}

export function useCreatePortalSession() {
	return useMutation({
		mutationFn: async () => {
			const res = await api.post<PortalResponse>("/v2/pluginator/portal");
			if (!res.success || !res.data) {
				throw new Error(res.error || "Failed to create portal session");
			}
			return res.data;
		},
	});
}
