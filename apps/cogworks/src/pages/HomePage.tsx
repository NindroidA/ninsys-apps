import { BotStatusBadge, FeatureCard, StatCard } from "@/components/cogworks";
import { features } from "@/data/features";
import { formatUptime, useBotStats, useBotStatus } from "@/hooks/useBotStatus";
import { Button } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Server, Ticket, Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Link } from "react-router-dom";

export function HomePage() {
	const { data: status } = useBotStatus();
	const { data: stats } = useBotStats();

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				{/* Background gradient orbs - use fixed positioning values and ensure visibility */}
				<div
					className="absolute inset-0 overflow-hidden pointer-events-none"
					style={{ zIndex: 0 }}
					aria-hidden="true"
				>
					<div
						className="absolute rounded-full blur-3xl"
						style={{
							top: "-5%",
							left: "15%",
							width: "400px",
							height: "400px",
							background: "oklch(0.55 0.20 280 / 0.25)",
						}}
					/>
					<div
						className="absolute rounded-full blur-3xl"
						style={{
							bottom: "-10%",
							right: "20%",
							width: "350px",
							height: "350px",
							background: "oklch(0.70 0.18 350 / 0.20)",
						}}
					/>
				</div>

				<div className="container mx-auto px-4">
					<FadeIn className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
							<BotStatusBadge status={status?.status ?? "offline"} size="sm" />
							<span className="text-sm font-medium text-primary">
								{status?.status === "online" ? "Bot is online" : "Checking status..."}
							</span>
						</div>

						<h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
							Discord Server Management <span className="gradient-text">Made Simple</span>
						</h1>

						<p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
							Cogworks is a powerful Discord bot for ticketing, applications, moderation, and more.
							Free, open-source, and designed for communities of all sizes.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button variant="primary" size="lg" asChild>
								<a
									href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands"
									target="_blank"
									rel="noopener noreferrer"
								>
									<SiDiscord className="mr-2 h-5 w-5" />
									Add to Discord
								</a>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link to="/features">
									Explore Features
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</FadeIn>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 sm:py-16 border-y border-border bg-card/50">
				<div className="container mx-auto px-4">
					<StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
							<StatCard
								label="Servers"
								value={stats?.serverCount?.toLocaleString() ?? "—"}
								icon={Server}
							/>
						</motion.div>
						<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
							<StatCard
								label="Users"
								value={stats?.userCount?.toLocaleString() ?? "—"}
								icon={Users}
							/>
						</motion.div>
						<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
							<StatCard
								label="Tickets Created"
								value={stats?.ticketsCreated?.toLocaleString() ?? "—"}
								icon={Ticket}
							/>
						</motion.div>
						<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
							<StatCard
								label="Uptime"
								value={status?.uptime ? formatUptime(status.uptime) : "—"}
								icon={Bot}
							/>
						</motion.div>
					</StaggerContainer>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 sm:py-20">
				<div className="container mx-auto px-4">
					<FadeIn className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
							Everything You Need to Manage Your Server
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
							From support tickets to staff applications, Cogworks has all the tools to keep your
							community running smoothly.
						</p>
					</FadeIn>

					<StaggerContainer className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
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
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-20 bg-linear-to-br from-primary/10 via-card to-accent/10">
				<div className="container mx-auto px-4">
					<FadeIn className="max-w-3xl mx-auto text-center">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
							Ready to Simplify Your Server Management?
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground mb-8">
							Join thousands of servers already using Cogworks. Free forever, no credit card
							required.
						</p>
						<Button variant="primary" size="lg" asChild className="whitespace-nowrap">
							<a
								href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands"
								target="_blank"
								rel="noopener noreferrer"
							>
								<SiDiscord className="mr-2 h-5 w-5" />
								<span className="hidden sm:inline">Add Cogworks to Your Server</span>
								<span className="sm:hidden">Add to Server</span>
							</a>
						</Button>
					</FadeIn>
				</div>
			</section>
		</div>
	);
}
