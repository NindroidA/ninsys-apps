/**
 * Checkout page - redirects to Stripe Checkout
 */

import { useCreateCheckout } from "@/hooks/useSubscription";
import { isValidStripeUrl } from "@/lib/stripe";
import type { Tier } from "@/types/tier";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function CheckoutPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const tier = searchParams.get("tier") as Tier | null;
	const createCheckout = useCreateCheckout();

	const hasTriggered = useRef(false);

	useEffect(() => {
		if (!tier || !["plus", "pro", "max"].includes(tier)) {
			navigate("/pricing");
			return;
		}
		if (hasTriggered.current) return;
		hasTriggered.current = true;

		createCheckout.mutate(tier, {
			onSuccess: (data) => {
				// Validate URL before redirecting to prevent open redirect
				if (isValidStripeUrl(data.url)) {
					window.location.href = data.url;
				} else {
					navigate("/pricing?error=invalid_checkout_url");
				}
			},
			onError: () => {
				// Error details not logged to prevent information disclosure
				navigate("/pricing?error=checkout_failed");
			},
		});
	}, [tier, createCheckout, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<FadeIn>
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
					<h1 className="text-xl font-semibold mb-2">Preparing Checkout</h1>
					<p className="text-muted-foreground">Redirecting you to secure payment...</p>
				</div>
			</FadeIn>
		</div>
	);
}
