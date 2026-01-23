import { FeatureCard } from "@/components/cogworks";
import { features } from "@/data/features";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function FeaturesPage() {
	return (
		<div className="min-h-screen py-20">
			<div className="container mx-auto px-4">
				{/* Header */}
				<FadeIn className="text-center mb-16">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">
						Powerful Features for Your Community
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need to manage your Discord server effectively, all in one bot.
					</p>
				</FadeIn>

				{/* Features Grid */}
				<StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
					{features.map((feature) => (
						<motion.div
							key={feature.id}
							variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
						>
							<FeatureCard
								title={feature.title}
								description={feature.description}
								icon={feature.icon}
								href={feature.href}
							/>
						</motion.div>
					))}
				</StaggerContainer>

				{/* Feature Details */}
				<div className="space-y-24">
					{features.map((feature, index) => (
						<FadeIn key={feature.id}>
							<div
								className={`flex flex-col ${
									index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
								} gap-12 items-center`}
							>
								{/* Content */}
								<div className="flex-1">
									<div className="inline-flex rounded-xl bg-primary/10 p-3 mb-4">
										<feature.icon className="h-8 w-8 text-primary" />
									</div>
									<h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
									<p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
									<ul className="space-y-3">
										{feature.highlights.map((highlight) => (
											<li key={highlight} className="flex items-center gap-3">
												<div className="rounded-full bg-success/10 p-1">
													<Check className="h-4 w-4 text-success" />
												</div>
												<span>{highlight}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Placeholder for screenshot/demo */}
								<div className="flex-1">
									<div className="aspect-video rounded-xl bg-card border border-border flex items-center justify-center">
										<div className="text-center text-muted-foreground">
											<feature.icon className="h-16 w-16 mx-auto mb-4 opacity-50" />
											<p>Feature Demo</p>
										</div>
									</div>
								</div>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</div>
	);
}
