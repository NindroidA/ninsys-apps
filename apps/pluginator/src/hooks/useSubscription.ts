/**
 * Subscription API hooks
 */

import { api } from "@/lib/api";
import type { BillingPeriod, SubscriptionInfo, Tier } from "@/types/tier";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

interface CreateCheckoutParams {
	tier: Tier;
	billingPeriod?: BillingPeriod;
}

export function useCreateCheckout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ tier, billingPeriod }: CreateCheckoutParams) => {
			const res = await api.post<CheckoutResponse>("/v2/pluginator/checkout", {
				tier,
				billingPeriod: billingPeriod ?? "monthly",
			});
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

export function useCancelSubscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const res = await api.post("/v2/pluginator/subscription/cancel");
			if (!res.success) {
				throw new Error(res.error || "Failed to cancel subscription");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription"] });
			queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
		},
	});
}

interface ChangePlanParams {
	tier: Tier;
	billingPeriod?: BillingPeriod;
}

export function useChangePlan() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ tier, billingPeriod }: ChangePlanParams) => {
			const body: { tier: Tier; billingPeriod?: BillingPeriod } = { tier };
			if (billingPeriod) body.billingPeriod = billingPeriod;
			const res = await api.post("/v2/pluginator/subscription/change-plan", body);
			if (!res.success) {
				throw new Error(res.error || "Failed to change plan");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription"] });
			queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
		},
	});
}

export function useReactivateSubscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const res = await api.post("/v2/pluginator/subscription/reactivate");
			if (!res.success) {
				throw new Error(res.error || "Failed to reactivate subscription");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription"] });
			queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
		},
	});
}
