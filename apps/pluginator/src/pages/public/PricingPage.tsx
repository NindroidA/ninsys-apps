import { PricingCard } from "@/components/pluginator";
import { COMPARISON_FEATURES, getPricingTiers } from "@/config/pricing";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ParallaxElement, ScrollProgress, TextReveal } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingPage() {
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
				<ParallaxElement speed={0.2} className="absolute" style={{ top: "40%", left: "50%" }}>
					<div
						className="rounded-full blur-2xl"
						style={{
							width: "200px",
							height: "200px",
							background: "oklch(0.627 0.265 303.9 / 0.1)",
						}}
					/>
				</ParallaxElement>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header with Text Reveal */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
					>
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">
							Simple pricing, powerful features
						</span>
					</motion.div>

					<TextReveal
						mode="word"
						className="text-4xl sm:text-5xl font-bold mb-4"
						as="h1"
						start="top 95%"
						end="top 75%"
					>
						Simple, Transparent Pricing
					</TextReveal>
					<FadeIn delay={0.2}>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Start free, upgrade when you need more. No hidden fees, cancel anytime.
						</p>
					</FadeIn>
				</div>

				{/* Pricing Cards with Scroll-Linked Stagger */}
				<ScrollProgress start="top 90%" end="top 40%">
					{({ progress }) => {
						const pricingTiers = getPricingTiers(false);
						return (
							<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
								{pricingTiers.map((plan, index) => {
									const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.1) * 2.5));
									const isHighlighted = plan.highlighted;
									return (
										<motion.div
											key={plan.tier}
											style={{
												opacity: 0.2 + cardProgress * 0.8,
												transform: `translateY(${(1 - cardProgress) * 50}px) scale(${0.95 + cardProgress * 0.05})`,
											}}
										>
											<div
												className="relative"
												style={{
													transform: isHighlighted
														? `translateY(${-cardProgress * 10}px)`
														: undefined,
												}}
											>
												<PricingCard
													tier={plan.tier}
													name={plan.name}
													price={plan.price}
													period={plan.priceSubtext}
													description={plan.description}
													features={plan.features}
													highlighted={plan.highlighted}
													ctaText={plan.ctaText}
													ctaHref={plan.tier === "free" ? "/download" : "/signup"}
												/>
											</div>
										</motion.div>
									);
								})}
							</div>
						);
					}}
				</ScrollProgress>

				{/* Feature Comparison Table */}
				<div className="max-w-5xl mx-auto">
					<TextReveal
						mode="word"
						className="text-2xl font-bold text-center mb-8"
						as="h2"
						start="top 90%"
						end="top 70%"
					>
						Feature Comparison
					</TextReveal>

					<ScrollProgress start="top 85%" end="top 35%">
						{({ progress }) => (
							<motion.div
								className="rounded-xl border border-border overflow-hidden overflow-x-auto"
								style={{
									opacity: Math.max(0.3, progress),
									transform: `translateY(${(1 - progress) * 30}px)`,
								}}
							>
								<table className="w-full">
									<thead>
										<tr className="bg-card">
											<th className="text-left p-4 font-medium">Feature</th>
											<th className="text-center p-4 font-medium">Free</th>
											<th className="text-center p-4 font-medium text-primary">Plus</th>
											<th className="text-center p-4 font-medium text-accent">Pro</th>
											<th className="text-center p-4 font-medium text-warning">Max</th>
										</tr>
									</thead>
									<tbody>
										{COMPARISON_FEATURES.map((feature, index) => {
											const rowProgress = Math.max(0, Math.min(1, (progress - index * 0.03) * 2));
											return (
												<motion.tr
													key={feature.name}
													className={index % 2 === 0 ? "bg-muted/30" : "bg-card"}
													style={{
														opacity: 0.3 + rowProgress * 0.7,
													}}
												>
													<td className="p-4 text-sm">{feature.name}</td>
													<td className="p-4 text-center">
														<FeatureValue value={feature.free} />
													</td>
													<td className="p-4 text-center">
														<FeatureValue value={feature.plus} />
													</td>
													<td className="p-4 text-center">
														<FeatureValue value={feature.pro} />
													</td>
													<td className="p-4 text-center">
														<FeatureValue value={feature.max} />
													</td>
												</motion.tr>
											);
										})}
									</tbody>
								</table>
							</motion.div>
						)}
					</ScrollProgress>
				</div>

				{/* FAQ - Coming Soon */}
				<FadeIn delay={0.3}>
					<div className="max-w-3xl mx-auto mt-20">
						<h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
						<div className="rounded-xl border border-border bg-card/50 p-8 text-center">
							<p className="text-muted-foreground">FAQ coming soon.</p>
						</div>
					</div>
				</FadeIn>

				{/* CTA */}
				<ScrollProgress start="top 90%" end="top 60%">
					{({ progress }) => (
						<motion.div
							className="text-center mt-16"
							style={{
								opacity: progress,
								transform: `scale(${0.95 + progress * 0.05})`,
							}}
						>
							<p className="text-muted-foreground mb-4">
								Still have questions?{" "}
								<Link to="/contact" className="text-primary hover:underline">
									Contact us
								</Link>
							</p>
						</motion.div>
					)}
				</ScrollProgress>
			</div>
		</div>
	);
}

function FeatureValue({ value }: { value: boolean | string }) {
	if (value === true) {
		return (
			<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10">
				<Check className="h-4 w-4 text-success" />
			</span>
		);
	}
	if (value === false) {
		return (
			<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
				<X className="h-4 w-4 text-muted-foreground" />
			</span>
		);
	}
	return <span className="text-sm font-medium">{value}</span>;
}
