import { PricingCard } from "@/components/pluginator/PricingCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { COMPARISON_FEATURES, getPricingTiers } from "@/config/pricing";
import { useAuth } from "@/hooks/useAuth";
import { useCancelSubscription, useChangePlan, useSubscription } from "@/hooks/useSubscription";
import { TIER_DISPLAY, type Tier, getTierLevel } from "@/types/tier";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ParallaxElement, ScrollProgress } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { Check, Info, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PricingPage() {
	const { user } = useAuth();
	const { data: subscription } = useSubscription();
	const cancelSubscription = useCancelSubscription();
	const changePlan = useChangePlan();
	const navigate = useNavigate();

	const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
	const [downgradeTier, setDowngradeTier] = useState<Tier | null>(null);

	const isAuthenticated = !!user;
	const currentTier = subscription?.tier ?? "free";
	const currentLevel = getTierLevel(currentTier);
	const hasPlusDiscount = subscription?.hasPlusDiscount ?? false;
	// Subscription level: treats Plus as non-subscription (level 0 for comparison)
	// Free=0, Plus=0 (one-time, not a subscription), Pro=2, Max=3
	const subscriptionLevel = currentTier === "plus" ? 0 : currentLevel;

	const tiers = getPricingTiers(hasPlusDiscount);

	const periodEndDate = subscription?.currentPeriodEnd
		? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			})
		: null;

	const fallbackTier = hasPlusDiscount ? "Plus" : "Free";

	function getCtaText(tier: Tier): string {
		if (!isAuthenticated) {
			return tier === "free"
				? "Get Started"
				: (tiers.find((t) => t.tier === tier)?.ctaText ?? "Subscribe");
		}

		// Plus is independent: show "Purchased" or "Get Plus"
		if (tier === "plus") {
			if (hasPlusDiscount) return "Purchased";
			return "Get Plus";
		}

		if (tier === currentTier) return "Current Plan";

		if (tier === "free") {
			if (hasPlusDiscount) return "Included with Plus";
			if (subscriptionLevel > 0) return "Downgrade";
			return "Current Plan";
		}

		// Subscription tiers: compare levels
		const tierLevel = getTierLevel(tier);
		if (tierLevel > currentLevel) {
			return tiers.find((t) => t.tier === tier)?.ctaText ?? "Upgrade";
		}
		if (tierLevel < currentLevel) return "Downgrade";

		return "Current Plan";
	}

	function isCtaDisabled(tier: Tier): boolean {
		if (!isAuthenticated) return false;
		if (tier === "plus") return hasPlusDiscount; // Disabled if already purchased
		if (tier === currentTier) return true;
		if (tier === "free" && hasPlusDiscount) return true; // Can't go below Plus
		if (tier === "free" && currentLevel === 0) return true; // Already on free
		return false;
	}

	function getCtaStyle(tier: Tier): "default" | "downgrade" | "current" {
		if (!isAuthenticated) return "default";
		if (tier === currentTier) return "current";
		if (tier === "plus" && hasPlusDiscount) return "current";
		if (tier === "free" && hasPlusDiscount) return "current";

		const tierLevel = getTierLevel(tier);
		if (tier !== "plus" && tierLevel < currentLevel) return "downgrade";

		return "default";
	}

	function handleCtaClick(tier: Tier) {
		if (!isAuthenticated) {
			if (tier === "free") {
				navigate("/download");
			} else {
				navigate("/login?returnTo=/pricing");
			}
			return;
		}

		if (isCtaDisabled(tier)) return;

		const tierLevel = getTierLevel(tier);

		// Plus purchase (always via checkout)
		if (tier === "plus") {
			setLoadingTier(tier);
			navigate("/checkout?tier=plus");
			return;
		}

		// Upgrade (via checkout)
		if (tierLevel > currentLevel) {
			setLoadingTier(tier);
			navigate(`/checkout?tier=${tier}`);
			return;
		}

		// Downgrade to Free = cancel subscription
		if (tier === "free") {
			setShowCancelDialog(true);
			return;
		}

		// Downgrade to lower subscription tier (e.g. Max → Pro)
		if (tierLevel < currentLevel) {
			setDowngradeTier(tier);
			setShowDowngradeDialog(true);
			return;
		}
	}

	async function handleCancelConfirm() {
		try {
			await cancelSubscription.mutateAsync();
			setShowCancelDialog(false);
		} catch {
			// Error state tracked by React Query
		}
	}

	async function handleDowngradeConfirm() {
		if (!downgradeTier) return;
		try {
			await changePlan.mutateAsync(downgradeTier);
			setShowDowngradeDialog(false);
			setDowngradeTier(null);
		} catch {
			// Error state tracked by React Query
		}
	}

	const currentTierName = TIER_DISPLAY[currentTier]?.name ?? currentTier;
	const downgradeTierName = downgradeTier ? TIER_DISPLAY[downgradeTier]?.name : "";

	return (
		<div className="min-h-screen py-20 relative overflow-hidden">
			{/* Parallax Background Orbs */}
			<div
				className="absolute inset-0 overflow-hidden pointer-events-none"
				style={{ zIndex: 0 }}
				aria-hidden="true"
			>
				<ParallaxElement speed={0.15} className="absolute" style={{ top: "5%", right: "10%" }}>
					<div
						className="rounded-full blur-3xl"
						style={{
							width: "350px",
							height: "350px",
							background: "oklch(0.627 0.265 303.9 / 0.2)",
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={-0.1} className="absolute" style={{ bottom: "20%", left: "5%" }}>
					<div
						className="rounded-full blur-3xl"
						style={{
							width: "300px",
							height: "300px",
							background: "oklch(0.70 0.20 290 / 0.15)",
						}}
					/>
				</ParallaxElement>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header */}
				<div className="text-center mb-8">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
					>
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Beta Pricing</span>
					</motion.div>

					<FadeIn>
						<h1 className="text-4xl sm:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
					</FadeIn>
					<FadeIn delay={0.1}>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Choose the plan that fits your needs. Start free, upgrade when you're ready.
						</p>
					</FadeIn>
				</div>

				{/* Beta Pricing Banner */}
				<FadeIn delay={0.15}>
					<div className="max-w-3xl mx-auto mb-12">
						<div className="rounded-xl bg-gradient-to-br from-amber-500/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
							<div className="rounded-xl p-4 flex items-start gap-3">
								<Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
								<p className="text-sm text-muted-foreground">
									<span className="font-medium text-amber-500">Beta Pricing</span> — Pricing shown
									is introductory beta pricing and may change. Early adopters will be honored at
									their purchase price.
								</p>
							</div>
						</div>
					</div>
				</FadeIn>

				{/* Pricing Cards */}
				<FadeIn delay={0.2}>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
						{tiers.map((tier) => (
							<PricingCard
								key={tier.tier}
								tier={tier.tier}
								name={tier.name}
								price={tier.price}
								originalPrice={tier.originalPrice}
								period={tier.priceSubtext || ""}
								description={tier.description}
								features={tier.features}
								highlighted={tier.highlighted}
								ctaText={getCtaText(tier.tier)}
								ctaDisabled={isCtaDisabled(tier.tier)}
								ctaLoading={loadingTier === tier.tier}
								ctaStyle={getCtaStyle(tier.tier)}
								onCtaClick={() => handleCtaClick(tier.tier)}
								className={tier.highlighted ? "" : "opacity-90"}
							/>
						))}
					</div>
				</FadeIn>

				{/* Comparison Table */}
				<ScrollProgress start="top 90%" end="top 50%">
					{({ progress }) => (
						<motion.div className="max-w-5xl mx-auto" style={{ opacity: 0.2 + progress * 0.8 }}>
							<h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Compare Plans</h2>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border">
											<th
												scope="col"
												className="text-left py-3 px-4 font-medium text-muted-foreground"
											>
												Feature
											</th>
											<th scope="col" className="text-center py-3 px-4 font-medium">
												Free
											</th>
											<th scope="col" className="text-center py-3 px-4 font-medium text-blue-500">
												Plus
											</th>
											<th scope="col" className="text-center py-3 px-4 font-medium text-primary">
												Pro
											</th>
											<th scope="col" className="text-center py-3 px-4 font-medium text-amber-500">
												Max
											</th>
										</tr>
									</thead>
									<tbody>
										{COMPARISON_FEATURES.map((feature) => (
											<tr
												key={feature.name}
												className="border-b border-border/50 hover:bg-muted/30 transition-colors"
											>
												<td className="py-3 px-4 font-medium">{feature.name}</td>
												{(["free", "plus", "pro", "max"] as const).map((t) => {
													const value = feature[t];
													return (
														<td key={t} className="text-center py-3 px-4">
															{value === true ? (
																<>
																	<Check
																		className="h-4 w-4 text-success mx-auto"
																		aria-hidden="true"
																	/>
																	<span className="sr-only">Included</span>
																</>
															) : value === false ? (
																<>
																	<X
																		className="h-4 w-4 text-muted-foreground/40 mx-auto"
																		aria-hidden="true"
																	/>
																	<span className="sr-only">Not included</span>
																</>
															) : (
																<span>{value}</span>
															)}
														</td>
													);
												})}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</motion.div>
					)}
				</ScrollProgress>
			</div>

			{/* Cancel Subscription Dialog (downgrade to Free/Plus) */}
			<ConfirmDialog
				open={showCancelDialog}
				onCancel={() => setShowCancelDialog(false)}
				onConfirm={handleCancelConfirm}
				title="Cancel Subscription?"
				description={`Your ${currentTierName} plan will remain active until ${
					periodEndDate ?? "the end of your billing period"
				}. After that, you'll be on the ${fallbackTier} plan.`}
				confirmText="Cancel Subscription"
				cancelText="Keep Subscription"
				loading={cancelSubscription.isPending}
				destructive
			/>

			{/* Plan Change Dialog (e.g. Max → Pro) */}
			<ConfirmDialog
				open={showDowngradeDialog}
				onCancel={() => {
					setShowDowngradeDialog(false);
					setDowngradeTier(null);
				}}
				onConfirm={handleDowngradeConfirm}
				title={`Switch to ${downgradeTierName}?`}
				description={`Your plan will be changed from ${currentTierName} to ${downgradeTierName}. Billing will be prorated — you'll receive credit for the remaining time on your current plan.`}
				confirmText={`Switch to ${downgradeTierName}`}
				cancelText="Keep Current Plan"
				loading={changePlan.isPending}
			/>
		</div>
	);
}
