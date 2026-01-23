/**
 * Payment success page
 */

import { TIER_DISPLAY, type Tier } from "@/types/tier";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function PaymentSuccessPage() {
	const [searchParams] = useSearchParams();
	const queryClient = useQueryClient();
	const tier = searchParams.get("tier") as Tier | null;

	useEffect(() => {
		// Invalidate subscription cache to fetch new tier
		queryClient.invalidateQueries({ queryKey: ["subscription"] });
		queryClient.invalidateQueries({ queryKey: ["usage"] });
	}, [queryClient]);

	const tierInfo = tier ? TIER_DISPLAY[tier] : null;

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<FadeIn>
				<div className="max-w-md w-full text-center">
					<div className="relative mb-6">
						<CheckCircle2 className="h-20 w-20 text-success mx-auto" />
						<PartyPopper className="h-8 w-8 text-warning absolute top-0 right-1/4 animate-bounce" />
					</div>

					<h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>

					<p className="text-lg text-muted-foreground mb-6">
						{tierInfo
							? `Welcome to Pluginator ${tierInfo.name}!`
							: "Your payment has been processed."}
					</p>

					<div className="p-6 rounded-xl bg-card border border-border mb-6">
						<p className="text-muted-foreground">
							Your account has been upgraded. You now have access to all{" "}
							<span className="font-semibold text-foreground">{tierInfo?.name}</span> features.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button asChild size="lg">
							<Link to="/dashboard">Go to Dashboard</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link to="/account">View Account</Link>
						</Button>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}
