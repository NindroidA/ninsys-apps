import { SEO } from "@/components/SEO";
import { BotStatusBadge, FeatureCard } from "@/components/cogworks";
import { features } from "@/data/features";
import { useBotStats, usePublicBotStatus } from "@/hooks/useBotStatus";
import { getBotInviteUrl } from "@/lib/constants";
import { formatUptime } from "@/lib/utils";
import { Button } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { ArrowRight, Clock, FlaskConical as Flask, Server } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Link } from "react-router-dom";

// Gear SVG with configurable tooth count for variety
function GearSvg({
	teeth = 8,
	className,
}: {
	teeth?: number;
	className?: string;
}) {
	const r1 = 38; // inner radius
	const r2 = 48; // outer radius (tooth tip)
	const cx = 50;
	const cy = 50;
	const toothWidth = Math.PI / teeth / 2;

	const path: string[] = [];
	for (let i = 0; i < teeth; i++) {
		const angle = (i / teeth) * Math.PI * 2;
		// tooth base start
		const a1 = angle - toothWidth;
		// tooth tip start
		const a2 = angle - toothWidth * 0.5;
		// tooth tip end
		const a3 = angle + toothWidth * 0.5;
		// tooth base end
		const a4 = angle + toothWidth;

		path.push(
			`${i === 0 ? "M" : "L"} ${cx + r1 * Math.cos(a1)} ${cy + r1 * Math.sin(a1)}`,
			`L ${cx + r2 * Math.cos(a2)} ${cy + r2 * Math.sin(a2)}`,
			`L ${cx + r2 * Math.cos(a3)} ${cy + r2 * Math.sin(a3)}`,
			`L ${cx + r1 * Math.cos(a4)} ${cy + r1 * Math.sin(a4)}`,
		);
	}
	path.push("Z");

	return (
		<svg
			viewBox="0 0 100 100"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-hidden="true"
		>
			<title>Decorative gear</title>
			<path d={path.join(" ")} stroke="currentColor" strokeWidth="1" />
			<circle cx={cx} cy={cy} r="14" stroke="currentColor" strokeWidth="1" />
			<circle cx={cx} cy={cy} r="6" stroke="currentColor" strokeWidth="0.5" />
		</svg>
	);
}

interface SpinningGearProps {
	teeth?: number;
	size: string;
	top?: string;
	bottom?: string;
	left?: string;
	right?: string;
	duration: number;
	direction?: 1 | -1;
	opacity?: number;
	color?: string;
}

function SpinningGear({
	teeth,
	size,
	top,
	bottom,
	left,
	right,
	duration,
	direction = 1,
	opacity = 0.06,
	color = "oklch(0.7 0.1 240)",
}: SpinningGearProps) {
	return (
		<motion.div
			animate={{ rotate: direction * 360 }}
			transition={{
				duration,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			className="absolute"
			style={{
				top,
				bottom,
				left,
				right,
				width: size,
				height: size,
				color,
				opacity,
			}}
		>
			<GearSvg teeth={teeth} className="w-full h-full" />
		</motion.div>
	);
}

function FloatingGears() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			{/* Ambient glows */}
			<div
				className="absolute rounded-full blur-[120px]"
				style={{
					top: "-10%",
					left: "-5%",
					width: "500px",
					height: "500px",
					background: "oklch(0.55 0.12 240 / 0.18)",
				}}
			/>
			<div
				className="absolute rounded-full blur-[100px]"
				style={{
					bottom: "-5%",
					right: "5%",
					width: "400px",
					height: "400px",
					background: "oklch(0.72 0.14 75 / 0.10)",
				}}
			/>

			{/* Large 12-tooth gear - top right, slow */}
			<SpinningGear
				teeth={12}
				size="280px"
				top="-40px"
				right="-60px"
				duration={80}
				direction={1}
				opacity={0.05}
			/>

			{/* Medium 8-tooth gear - meshing with the large one */}
			<SpinningGear
				teeth={8}
				size="180px"
				top="180px"
				right="140px"
				duration={52}
				direction={-1}
				opacity={0.04}
			/>

			{/* Small 6-tooth brass gear - left side */}
			<SpinningGear
				teeth={6}
				size="120px"
				bottom="15%"
				left="-30px"
				duration={35}
				direction={1}
				opacity={0.07}
				color="oklch(0.72 0.14 75)"
			/>

			{/* Tiny 10-tooth gear - center-left, fast */}
			<SpinningGear
				teeth={10}
				size="90px"
				top="60%"
				left="18%"
				duration={25}
				direction={-1}
				opacity={0.03}
			/>

			{/* Medium 14-tooth gear - bottom right */}
			<SpinningGear
				teeth={14}
				size="220px"
				bottom="-50px"
				right="20%"
				duration={90}
				direction={1}
				opacity={0.04}
				color="oklch(0.65 0.12 240)"
			/>

			{/* Small brass gear - top left area */}
			<SpinningGear
				teeth={6}
				size="70px"
				top="25%"
				left="8%"
				duration={20}
				direction={1}
				opacity={0.06}
				color="oklch(0.72 0.14 75)"
			/>
		</div>
	);
}

export function HomePage() {
	const { data: status } = usePublicBotStatus();
	const { data: stats } = useBotStats();

	return (
		<div className="min-h-screen">
			<SEO
				title="Your Server's Missing Cog"
				description="A powerful Discord bot with tickets, applications, announcements, XP & levels, starboard, bait channel detection, and more."
				path="/"
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
				<FloatingGears />

				<div className="container mx-auto px-4 relative z-10">
					<FadeIn className="max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
							<BotStatusBadge status={status?.status ?? "offline"} size="sm" />
							<span className="text-sm font-medium text-primary">
								{status?.status === "online" ? "Bot is online" : "Checking status..."}
							</span>
						</div>

						<h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
							Your Server's <span className="gradient-text">Missing Cog</span>
						</h1>

						<p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl">
							Cogworks is a powerful Discord bot for ticketing, applications, moderation, and more.
							Free, source-available, and designed for communities of all sizes.
						</p>

						<div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
							<Button variant="primary" size="lg" asChild>
								<a href={getBotInviteUrl("")} target="_blank" rel="noopener noreferrer">
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

						{/* Inline stats */}
						<div className="flex items-center gap-8 text-sm">
							<div className="flex items-center gap-2">
								<Server className="h-4 w-4 text-primary" />
								<span className="font-semibold">{stats?.serverCount?.toLocaleString() ?? "—"}</span>
								<span className="text-muted-foreground">servers</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-accent" />
								<span className="font-semibold">
									{status?.uptime ? formatUptime(status.uptime) : "—"}
								</span>
								<span className="text-muted-foreground">uptime</span>
							</div>
						</div>

						{/* Dashboard Beta Card */}
						<div className="mt-14 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] to-orange-500/[0.04] p-5 sm:p-6 flex items-start gap-4 max-w-2xl">
							<div className="rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/15 p-2.5 flex-shrink-0">
								<Flask className="h-5 w-5 text-amber-500" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-sm font-semibold">Web Dashboard</h3>
									<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 border border-amber-500/40 text-amber-500 font-semibold uppercase tracking-wider">
										Beta
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Manage your bot configuration from the web. The dashboard is in beta — the bot
									itself is fully stable and production-ready.
								</p>
							</div>
							<Link
								to="/login"
								className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors flex-shrink-0"
							>
								Try it out
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</FadeIn>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 sm:py-24 relative overflow-hidden">
				<FloatingGears />
				<div className="container mx-auto px-4 relative z-10">
					<FadeIn className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
							Everything You Need to{" "}
							<span className="cogworks-gradient-text">Manage Your Server</span>
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
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<FeatureCard
									title={feature.title}
									description={feature.description}
									icon={feature.icon}
								/>
							</motion.div>
						))}
					</StaggerContainer>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 relative overflow-hidden">
				{/* Brass-tinted glow */}
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none"
					aria-hidden="true"
				>
					<div className="w-[500px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<FadeIn className="max-w-3xl mx-auto text-center">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
							Get Started in Seconds
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground mb-8">
							Add Cogworks to your server and run{" "}
							<code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">/bot-setup</code> —
							that's it.
						</p>
						<Button variant="primary" size="lg" asChild className="whitespace-nowrap">
							<a href={getBotInviteUrl("")} target="_blank" rel="noopener noreferrer">
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
