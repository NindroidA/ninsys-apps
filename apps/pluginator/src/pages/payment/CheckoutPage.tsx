/**
 * Checkout page - redirects to Stripe Checkout
 */

import { FadeIn } from "@ninsys/ui/components/animations";
import { useCreateCheckout } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Tier } from "@/types/tier";

/** Allowed Stripe checkout URL prefixes */
const ALLOWED_CHECKOUT_DOMAINS = [
	"https://checkout.stripe.com",
	"https://billing.stripe.com",
];

/**
 * Validates that a URL is a legitimate Stripe checkout URL
 */
function isValidStripeUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return ALLOWED_CHECKOUT_DOMAINS.some(
			(domain) => url.startsWith(domain) && parsed.protocol === "https:"
		);
	} catch {
		return false;
	}
}

export function CheckoutPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const tier = searchParams.get("tier") as Tier | null;
	const createCheckout = useCreateCheckout();

	useEffect(() => {
		if (!tier || !["plus", "pro", "max"].includes(tier)) {
			navigate("/pricing");
			return;
		}

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
	}, [tier, createCheckout.mutate, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<FadeIn>
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
					<h1 className="text-xl font-semibold mb-2">Preparing Checkout</h1>
					<p className="text-muted-foreground">
						Redirecting you to secure payment...
					</p>
				</div>
			</FadeIn>
		</div>
	);
}
