import { FadeIn } from "@ninsys/ui/components/animations";
import { ScrollProgress, TextReveal } from "@ninsys/ui/components/scroll";
import { Button } from "@ninsys/ui/components";
import { features } from "@/data/features";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Sparkles, Zap, Shield, Clock, Globe, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

// Floating geometric elements for sections
function FloatingElements({ variant = "default" }: { variant?: "default" | "alt" }) {
	const color = variant === "default" ? "rgb(168, 85, 247)" : "rgb(139, 92, 246)";

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			{/* Floating ring */}
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
				className="absolute top-[20%] right-[10%] w-20 h-20 rounded-full border-2 opacity-15"
				style={{ borderColor: color }}
			/>
			{/* Floating dots */}
			<motion.div
				animate={{ y: [-6, 6, -6] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[40%] left-[15%] w-2 h-2 rounded-full opacity-30"
				style={{ background: color }}
			/>
			<motion.div
				animate={{ y: [5, -5, 5] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
				className="absolute bottom-[30%] right-[20%] w-3 h-3 rounded-full opacity-25"
				style={{ background: color }}
			/>
			{/* Cross */}
			<motion.div
				animate={{ rotate: [0, 180] }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
				className="absolute bottom-[25%] left-[8%] opacity-20"
			>
				<div className="relative w-5 h-5">
					<div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2" style={{ background: color }} />
					<div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2" style={{ background: color }} />
				</div>
			</motion.div>
		</div>
	);
}

export function HomePage() {
	const heroRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});

	const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
	const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.92]);
	const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 100]);

	// Scroll indicator - shows once on page load, then fades away
	const [showScrollHint, setShowScrollHint] = useState(false);

	useEffect(() => {
		// Fade in after a short delay
		const showTimer = setTimeout(() => setShowScrollHint(true), 1500);

		// Auto-hide after a few seconds
		const hideTimer = setTimeout(() => setShowScrollHint(false), 6000);

		// Also hide on any scroll
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setShowScrollHint(false);
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="min-h-screen bg-background">
			{/* ===== HERO SECTION - STANDOUT ===== */}
			<section
				ref={heroRef}
				className="relative overflow-hidden min-h-[100vh] flex items-center"
			>
				{/* Hero dramatic background */}
				<div className="absolute inset-0 overflow-hidden">
					{/* Main gradient wash */}
					<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/15" />

					{/* Large animated orbs */}
					<motion.div
						animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
						transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
						className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full blur-3xl"
						style={{ background: "rgb(168, 85, 247)" }}
					/>
					<motion.div
						animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
						transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
						className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
						style={{ background: "rgb(139, 92, 246)" }}
					/>
					<motion.div
						animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
						transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
						style={{ background: "rgb(192, 132, 252)" }}
					/>

					{/* Floating geometric elements */}
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
						className="absolute top-[15%] right-[15%] w-32 h-32 rounded-full border-2 opacity-20"
						style={{ borderColor: "rgb(168, 85, 247)" }}
					/>
					<motion.div
						animate={{ rotate: -360 }}
						transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
						className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full border opacity-15"
						style={{ borderColor: "rgb(139, 92, 246)" }}
					/>
					<motion.div
						animate={{ y: [-10, 10, -10] }}
						transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
						className="absolute top-[30%] left-[20%] w-4 h-4 rounded-full opacity-40"
						style={{ background: "rgb(168, 85, 247)" }}
					/>
					<motion.div
						animate={{ y: [8, -8, 8] }}
						transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
						className="absolute top-[60%] right-[25%] w-3 h-3 rounded-full opacity-50"
						style={{ background: "rgb(192, 132, 252)" }}
					/>
					<motion.div
						animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
						className="absolute bottom-[35%] right-[12%] w-3 h-3 rounded-full"
						style={{
							background: "rgb(168, 85, 247)",
							boxShadow: "0 0 20px rgb(168, 85, 247), 0 0 40px rgb(168, 85, 247)"
						}}
					/>
					{/* Diamond */}
					<motion.div
						animate={{ rotate: [45, 405] }}
						transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
						className="absolute top-[45%] right-[8%] w-10 h-10 border-2 opacity-20"
						style={{ borderColor: "rgb(139, 92, 246)" }}
					/>
					{/* Cross */}
					<motion.div
						animate={{ rotate: [0, 180] }}
						transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
						className="absolute bottom-[40%] left-[8%] opacity-25"
					>
						<div className="relative w-8 h-8">
							<div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-purple-400" />
							<div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-purple-400" />
						</div>
					</motion.div>
				</div>

				<motion.div
					className="container mx-auto px-4 relative z-10 py-20"
					style={{
						opacity: heroOpacity,
						scale: heroScale,
						y: heroY,
					}}
				>
					<FadeIn className="max-w-4xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, ease: "easeOut" }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
						>
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium text-primary">
								Now with web dashboard support
							</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
							className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6"
						>
							Manage Your Minecraft Plugins{" "}
							<span className="gradient-text">with Ease</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
							className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
						>
							Update, sync, and backup plugins across all your servers. One tool, multiple sources,
							zero hassle.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
							className="flex flex-col sm:flex-row items-center justify-center gap-4"
						>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
								<Button variant="primary" size="lg" asChild className="text-lg px-8 py-6">
									<Link to="/download">
										<Download className="mr-2 h-5 w-5" />
										Download Free
									</Link>
								</Button>
							</motion.div>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
								<Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 bg-white/5 backdrop-blur-sm">
									<Link to="/pricing">
										View Pricing
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
							</motion.div>
						</motion.div>

					</FadeIn>
				</motion.div>

				{/* Scroll Indicator - fades in once, then disappears */}
				<AnimatePresence>
					{showScrollHint && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
							className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
						>
							<span className="text-xs text-muted-foreground uppercase tracking-widest">
								Scroll to explore
							</span>
							<motion.div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
								<motion.div
									animate={{ y: [0, 12, 0] }}
									transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
									className="w-1.5 h-1.5 bg-primary rounded-full"
								/>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</section>

			{/* ===== CONTENT SECTIONS - Seamless flow ===== */}
			<div className="bg-card/50">
				{/* Highlights Strip */}
				<section className="py-20 relative overflow-hidden">
					<FloatingElements variant="alt" />

					<ScrollProgress start="top 95%" end="top 20%">
						{({ progress }) => (
							<div className="container mx-auto px-4 relative z-10">
								<motion.div
									className="flex flex-wrap justify-center gap-12 lg:gap-16"
									style={{ opacity: 0.1 + progress * 0.9 }}
								>
									{[
										{ icon: Zap, label: "Lightning Fast", sublabel: "Rust-powered CLI" },
										{ icon: Shield, label: "Secure", sublabel: "Auto-backups" },
										{ icon: Globe, label: "8 Sources", sublabel: "All platforms" },
										{ icon: Clock, label: "Time Saver", sublabel: "One command" },
									].map((item, index) => {
										const itemProgress = Math.max(0, Math.min(1, (progress - index * 0.08) * 1.5));
										return (
											<motion.div
												key={item.label}
												className="flex items-center gap-4 group"
												style={{
													opacity: 0.1 + itemProgress * 0.9,
													transform: `translateY(${(1 - itemProgress) * 50}px)`,
												}}
											>
												<motion.div
													className="rounded-2xl bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors duration-300"
													whileHover={{ scale: 1.1, rotate: 5 }}
												>
													<item.icon className="h-7 w-7 text-primary" />
												</motion.div>
												<div>
													<p className="font-bold text-lg">{item.label}</p>
													<p className="text-sm text-muted-foreground">{item.sublabel}</p>
												</div>
											</motion.div>
										);
									})}
								</motion.div>
							</div>
						)}
					</ScrollProgress>
				</section>

				{/* Features Section */}
				<section className="py-28 sm:py-36 relative overflow-hidden">
					<FloatingElements />

					<div className="container mx-auto px-4 relative z-10">
						<div className="text-center mb-20 sm:mb-24">
							<TextReveal
								mode="word"
								className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-6"
								as="h2"
								start="top 90%"
								end="top 40%"
							>
								Everything You Need for Plugin Management
							</TextReveal>
							<ScrollProgress start="top 85%" end="top 50%">
								{({ progress }) => (
									<p
										className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
										style={{ opacity: 0.1 + progress * 0.9 }}
									>
										From a single server to an entire network, Pluginator scales with your needs.
									</p>
								)}
							</ScrollProgress>
						</div>

						<ScrollProgress start="top 85%" end="bottom 40%">
							{({ progress }) => (
								<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
									{features.map((feature, index) => {
										const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.06) * 1.8));
										return (
											<motion.div
												key={feature.id}
												style={{
													opacity: 0.1 + cardProgress * 0.9,
													transform: `translateY(${(1 - cardProgress) * 60}px) scale(${0.9 + cardProgress * 0.1})`,
												}}
												whileHover={{ y: -8, transition: { duration: 0.3 } }}
												className="group rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
											>
												<motion.div
													className="mb-4 sm:mb-5 inline-flex rounded-2xl bg-primary/10 p-3 sm:p-4 group-hover:bg-primary/20 transition-colors duration-300"
													whileHover={{ rotate: 10, scale: 1.1 }}
												>
													<feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
												</motion.div>
												<h3 className="text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
												<p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
											</motion.div>
										);
									})}
								</div>
							)}
						</ScrollProgress>
					</div>
				</section>

				{/* How It Works */}
				<section className="py-28 sm:py-36 relative overflow-hidden">
					<FloatingElements variant="alt" />

					<div className="container mx-auto px-4 relative z-10">
						<div className="text-center mb-20 sm:mb-24">
							<TextReveal
								mode="word"
								className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-6"
								as="h2"
								start="top 90%"
								end="top 40%"
							>
								How It Works
							</TextReveal>
							<ScrollProgress start="top 85%" end="top 50%">
								{({ progress }) => (
									<p
										className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
										style={{ opacity: 0.1 + progress * 0.9 }}
									>
										Get started in minutes with our simple workflow.
									</p>
								)}
							</ScrollProgress>
						</div>

						<div className="grid sm:grid-cols-3 gap-12 max-w-5xl mx-auto">
							{[
								{ step: "1", title: "Scan", description: "Point Pluginator at your plugins folder and it auto-generates a config file." },
								{ step: "2", title: "Check", description: "Run one command to check for updates across all sources." },
								{ step: "3", title: "Update", description: "Apply updates safely with automatic backups before changes." },
							].map((item, index) => (
								<ScrollProgress key={item.step} start="top 90%" end="top 30%">
									{({ progress }) => {
										const itemProgress = Math.max(0, Math.min(1, (progress - index * 0.1) * 1.5));
										return (
											<motion.div
												style={{
													opacity: 0.1 + itemProgress * 0.9,
													transform: `translateY(${(1 - itemProgress) * 50}px) scale(${0.9 + itemProgress * 0.1})`,
												}}
												className="text-center"
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
											>
												<motion.div
													className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full pluginator-gradient text-white font-bold text-2xl sm:text-3xl mb-6 shadow-lg"
													style={{
														boxShadow: `0 0 ${itemProgress * 30}px rgba(168, 85, 247, ${itemProgress * 0.5})`,
													}}
													whileHover={{ scale: 1.1 }}
												>
													{item.step}
												</motion.div>
												<h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
												<p className="text-base sm:text-lg text-muted-foreground">{item.description}</p>
											</motion.div>
										);
									}}
								</ScrollProgress>
							))}
						</div>
					</div>
				</section>

				{/* Why Pluginator Section */}
				<section className="py-24 sm:py-32 relative overflow-hidden">
					<FloatingElements />

					<div className="container mx-auto px-4 relative z-10">
						<ScrollProgress start="top 90%" end="top 30%">
							{({ progress }) => (
								<div className="max-w-4xl mx-auto">
									<div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
										{[
											{ title: "Free Forever", description: "No hidden fees, no trials. Core features are always free." },
											{ title: "Multiple Sources", description: "Spiget, Modrinth, Jenkins, and more." },
											{ title: "Cross-Platform", description: "Works on Windows, macOS, and Linux." },
											{ title: "Fast Updates", description: "Check all your plugins in seconds." },
										].map((item, index) => {
											const itemProgress = Math.max(0, Math.min(1, (progress - index * 0.08) * 1.6));
											return (
												<motion.div
													key={item.title}
													style={{
														opacity: 0.1 + itemProgress * 0.9,
														transform: `translateY(${(1 - itemProgress) * 30}px)`,
													}}
													className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors"
												>
													<div className="flex-shrink-0 h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
														<Check className="h-4 w-4 text-success" />
													</div>
													<div>
														<h3 className="font-semibold text-lg mb-1">{item.title}</h3>
														<p className="text-muted-foreground text-sm">{item.description}</p>
													</div>
												</motion.div>
											);
										})}
									</div>
								</div>
							)}
						</ScrollProgress>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-28 sm:py-36 relative overflow-hidden">
					<FloatingElements variant="alt" />

					{/* Subtle glow for CTA */}
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
					</div>

					<div className="container mx-auto px-4 relative z-10">
						<ScrollProgress start="top 90%" end="top 40%">
							{({ progress }) => (
								<motion.div
									className="max-w-4xl mx-auto text-center"
									style={{
										opacity: 0.1 + progress * 0.9,
										transform: `translateY(${(1 - progress) * 40}px)`,
									}}
								>
									<TextReveal
										mode="word"
										className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-6"
										as="h2"
										start="top 90%"
										end="top 40%"
									>
										Ready to Simplify Plugin Management?
									</TextReveal>
									<p
										className="text-lg sm:text-xl text-muted-foreground mb-10"
										style={{ opacity: 0.2 + progress * 0.8 }}
									>
										Join thousands of server owners who trust Pluginator. Free to start, upgrade anytime.
									</p>
									<motion.div
										className="flex flex-col sm:flex-row items-center justify-center gap-5"
										style={{
											opacity: 0.2 + progress * 0.8,
											transform: `translateY(${(1 - progress) * 20}px)`,
										}}
									>
										<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
											<Button variant="primary" size="lg" asChild>
												<Link to="/download">
													<Download className="mr-2 h-5 w-5" />
													Download Now
												</Link>
											</Button>
										</motion.div>
										<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
											<Button variant="outline" size="lg" asChild>
												<Link to="/pricing">Compare Plans</Link>
											</Button>
										</motion.div>
									</motion.div>
								</motion.div>
							)}
						</ScrollProgress>
					</div>
				</section>
			</div>
		</div>
	);
}
