import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ParallaxElement, ScrollProgress, TextReveal } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { Apple, Clock, Download, Monitor, Shield, Terminal, Zap } from "lucide-react";

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
	{ icon: Zap, title: "Lightning Fast", description: "Written in Rust for maximum performance" },
	{ icon: Shield, title: "Secure", description: "Automatic backups before every update" },
	{ icon: Clock, title: "Time Saver", description: "Update all plugins with one command" },
];

export function DownloadPage() {
	const getDownloadUrl = (fileName: string) =>
		`https://github.com/NindroidA/pluginator-public/releases/latest/download/${fileName}`;

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
												variant={dl.primary ? "primary" : "outline"}
												className="w-full"
												asChild
											>
												<a href={getDownloadUrl(dl.fileName)} download>
													<Download className="mr-2 h-4 w-4" />
													Download
												</a>
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

				{/* Alternative Installation */}
				<div className="max-w-2xl mx-auto">
					<TextReveal
						mode="word"
						className="text-xl font-bold text-center mb-6"
						as="h3"
						start="top 90%"
						end="top 70%"
					>
						Alternative Installation Methods
					</TextReveal>

					<ScrollProgress start="top 85%" end="top 45%">
						{({ progress }) => (
							<motion.div
								className="rounded-xl border border-border bg-card p-6"
								style={{
									opacity: Math.max(0.3, progress),
									transform: `translateY(${(1 - progress) * 40}px)`,
								}}
							>
								<div className="space-y-4">
									{[
										{ label: "Via Cargo (Rust)", code: "cargo install pluginator" },
										{
											label: "Via Homebrew (macOS/Linux)",
											code: "brew install nindroida/tap/pluginator",
										},
										{
											label: "From Source",
											code: "git clone https://github.com/NindroidA/pluginator-public && cd pluginator-public && cargo build --release",
										},
									].map((method, index) => {
										const methodProgress = Math.max(
											0,
											Math.min(1, (progress - index * 0.15) * 2.5),
										);
										return (
											<motion.div
												key={method.label}
												style={{
													opacity: 0.3 + methodProgress * 0.7,
													transform: `translateX(${(1 - methodProgress) * -20}px)`,
												}}
											>
												<p className="text-sm font-medium mb-2 flex items-center gap-2">
													<Terminal className="h-4 w-4 text-primary" />
													{method.label}
												</p>
												<code className="block bg-muted px-4 py-3 rounded-lg text-sm font-mono overflow-x-auto">
													{method.code}
												</code>
											</motion.div>
										);
									})}
								</div>
							</motion.div>
						)}
					</ScrollProgress>
				</div>

				{/* Quick Start */}
				<div className="max-w-2xl mx-auto mt-12">
					<TextReveal
						mode="word"
						className="text-xl font-bold text-center mb-6"
						as="h3"
						start="top 90%"
						end="top 70%"
					>
						Quick Start Guide
					</TextReveal>

					<ScrollProgress start="top 85%" end="bottom 50%">
						{({ progress }) => (
							<motion.div
								className="rounded-xl border border-border bg-card p-6"
								style={{
									opacity: Math.max(0.3, progress),
									transform: `translateY(${(1 - progress) * 30}px)`,
								}}
							>
								<ol className="space-y-4">
									{[
										{
											step: 1,
											title: "Navigate to your server's plugins folder",
											code: "cd /path/to/server/plugins",
										},
										{ step: 2, title: "Initialize Pluginator", code: "pluginator init" },
										{ step: 3, title: "Add your first plugin", code: "pluginator add EssentialsX" },
										{ step: 4, title: "Check for updates", code: "pluginator check" },
									].map((item, index) => {
										const stepProgress = Math.max(0, Math.min(1, (progress - index * 0.1) * 2.5));
										return (
											<motion.li
												key={item.step}
												className="flex gap-4"
												style={{
													opacity: 0.3 + stepProgress * 0.7,
													transform: `translateX(${(1 - stepProgress) * 30}px)`,
												}}
											>
												<motion.span
													className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
													style={{
														transform: `scale(${0.8 + stepProgress * 0.2})`,
														boxShadow: `0 0 ${stepProgress * 15}px oklch(0.627 0.265 303.9 / ${stepProgress * 0.4})`,
													}}
												>
													{item.step}
												</motion.span>
												<div>
													<p className="font-medium">{item.title}</p>
													<code className="text-sm text-muted-foreground">{item.code}</code>
												</div>
											</motion.li>
										);
									})}
								</ol>
							</motion.div>
						)}
					</ScrollProgress>
				</div>
			</div>
		</div>
	);
}
