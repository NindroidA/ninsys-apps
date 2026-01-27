import { FadeIn } from "@ninsys/ui/components/animations";
import { ParallaxElement } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";

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
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
					>
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Pricing</span>
					</motion.div>

					<FadeIn>
						<h1 className="text-4xl sm:text-5xl font-bold mb-4">Coming Soon</h1>
					</FadeIn>
					<FadeIn delay={0.1}>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							We're working on something great. Check back soon for pricing details.
						</p>
					</FadeIn>
				</div>

				{/* Coming Soon Card */}
				<FadeIn delay={0.2}>
					<div className="max-w-md mx-auto">
						<div className="rounded-2xl border border-border bg-card/50 p-12 text-center">
							<div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
								<Clock className="h-8 w-8 text-primary" />
							</div>
							<h2 className="text-xl font-semibold mb-3">Pricing Coming Soon</h2>
							<p className="text-muted-foreground text-sm">
								We're finalizing our pricing tiers. In the meantime, Pluginator is free to download
								and use with basic features.
							</p>
						</div>
					</div>
				</FadeIn>
			</div>
		</div>
	);
}
