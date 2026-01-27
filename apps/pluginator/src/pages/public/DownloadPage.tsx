import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ParallaxElement, ScrollProgress, TextReveal } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { Apple, Clock, Download, Monitor, Shield, Zap } from "lucide-react";

const downloads = [
	{
		os: "Windows",
		icon: Monitor,
		description: "Windows 10/11 (64-bit)",
		fileName: "pluginator-windows-x64.exe",
		primary: true,
	},
	{
		os: "macOS",
		icon: Apple,
		description: "macOS 12+ (Apple Silicon & Intel)",
		fileName: "pluginator-macos-universal.tar.gz",
		primary: false,
	},
	{
		os: "Linux",
		icon: Monitor,
		description: "Linux (64-bit)",
		fileName: "pluginator-linux-x64.tar.gz",
		primary: false,
	},
];

const features = [
	{ icon: Zap, title: "Lightning Fast", description: "Built with TypeScript and powered by Bun" },
	{ icon: Shield, title: "Secure", description: "Automatic backups before every update" },
	{ icon: Clock, title: "Time Saver", description: "Update all plugins with one command" },
];

export function DownloadPage() {
	return (
		<div className="min-h-screen py-20 relative overflow-hidden">
			{/* Parallax Background Orbs */}
			<div
				className="absolute inset-0 overflow-hidden pointer-events-none"
				style={{ zIndex: 0 }}
				aria-hidden="true"
			>
				<ParallaxElement speed={0.2} className="absolute" style={{ top: "10%", left: "10%" }}>
					<div
						className="rounded-full blur-3xl"
						style={{
							width: "400px",
							height: "400px",
							background: "oklch(0.627 0.265 303.9 / 0.2)",
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={-0.15} className="absolute" style={{ bottom: "10%", right: "15%" }}>
					<div
						className="rounded-full blur-3xl"
						style={{
							width: "350px",
							height: "350px",
							background: "oklch(0.70 0.20 290 / 0.15)",
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={0.25} className="absolute" style={{ top: "50%", right: "5%" }}>
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
				{/* Header with entrance animation */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 30, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6"
					>
						<Download className="h-4 w-4 text-success" />
						<span className="text-sm font-medium text-success">
							Free forever, no account required
						</span>
					</motion.div>

					<TextReveal
						mode="word"
						className="text-4xl sm:text-5xl font-bold mb-4"
						as="h1"
						start="top 95%"
						end="top 75%"
					>
						Download Pluginator
					</TextReveal>
					<FadeIn delay={0.2}>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Get the CLI tool for your operating system. Manage all your Minecraft plugins with
							ease.
						</p>
					</FadeIn>
				</div>

				{/* Download Cards with Staggered Scroll Animation */}
				<ScrollProgress start="top 90%" end="top 50%">
					{({ progress }) => (
						<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
							{downloads.map((dl, index) => {
								const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.12) * 2.5));
								return (
									<motion.div
										key={dl.os}
										style={{
											opacity: 0.2 + cardProgress * 0.8,
											transform: `translateY(${(1 - cardProgress) * 60}px) rotateX(${(1 - cardProgress) * 10}deg)`,
										}}
									>
										<div
											className={`rounded-2xl border-2 ${
												dl.primary ? "border-primary" : "border-border"
											} bg-card p-8 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10`}
											style={{
												transform: dl.primary ? `scale(${1 + cardProgress * 0.03})` : undefined,
											}}
										>
											<motion.div
												className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4"
												style={{
													transform: `rotate(${(1 - cardProgress) * -10}deg)`,
												}}
											>
												<dl.icon className="h-8 w-8 text-primary" />
											</motion.div>
											<h2 className="text-xl font-bold mb-2">{dl.os}</h2>
											<p className="text-sm text-muted-foreground mb-6">{dl.description}</p>
											<Button
												variant="outline"
												className="w-full opacity-50 cursor-not-allowed"
												disabled
											>
												<Download className="mr-2 h-4 w-4" />
												Coming Soon
											</Button>
										</div>
									</motion.div>
								);
							})}
						</div>
					)}
				</ScrollProgress>

				{/* Features Strip */}
				<ScrollProgress start="top 85%" end="top 50%">
					{({ progress }) => (
						<motion.div
							className="flex flex-wrap justify-center gap-8 mb-16"
							style={{
								opacity: progress,
							}}
						>
							{features.map((feature, index) => {
								const featureProgress = Math.max(0, Math.min(1, (progress - index * 0.1) * 2));
								return (
									<motion.div
										key={feature.title}
										className="flex items-center gap-3"
										style={{
											opacity: 0.3 + featureProgress * 0.7,
											transform: `translateY(${(1 - featureProgress) * 20}px)`,
										}}
									>
										<div className="rounded-lg bg-primary/10 p-2">
											<feature.icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium text-sm">{feature.title}</p>
											<p className="text-xs text-muted-foreground">{feature.description}</p>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					)}
				</ScrollProgress>

				{/* Alternative Installation & Quick Start - Coming Soon */}
				<FadeIn delay={0.3}>
					<div className="max-w-2xl mx-auto mt-8">
						<div className="rounded-xl border border-border bg-card/50 p-8 text-center">
							<p className="text-muted-foreground">
								Installation guides and quick start documentation coming soon.
							</p>
						</div>
					</div>
				</FadeIn>
			</div>
		</div>
	);
}
