import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { BotStatusBadge, StatCard } from "@/components/cogworks";
import { formatUptime, useBotStats, useBotStatus } from "@/hooks/useBotStatus";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Activity, Clock, Server, Ticket, Users, Zap } from "lucide-react";

export function StatusPage() {
	const { data: status, isLoading: statusLoading, error: statusError } = useBotStatus();
	const { data: stats, isLoading: statsLoading } = useBotStats();

	const isLoading = statusLoading || statsLoading;

	return (
		<div className="min-h-screen py-20">
			<div className="container mx-auto px-4">
				{/* Header */}
				<FadeIn className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">Bot Status</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Real-time status and statistics for the Cogworks Discord bot.
					</p>
				</FadeIn>

				{/* Main Status Card */}
				<FadeIn className="max-w-2xl mx-auto mb-12">
					<div className="rounded-2xl border border-border bg-card p-8">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="h-16 w-16 rounded-2xl discord-gradient flex items-center justify-center">
									<span className="text-3xl">🤖</span>
								</div>
								<div>
									<h2 className="text-2xl font-bold">Cogworks</h2>
									<p className="text-muted-foreground">Discord Bot</p>
								</div>
							</div>
							<BotStatusBadge status={status?.status ?? "offline"} showLabel size="lg" />
						</div>

						{statusError ? (
							<div className="text-center py-8 text-error">
								<p>Unable to fetch bot status</p>
								<p className="text-sm text-muted-foreground mt-2">
									The API may be temporarily unavailable
								</p>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-6">
								<div className="rounded-xl bg-muted/50 p-4">
									<div className="flex items-center gap-2 text-muted-foreground mb-2">
										<Zap className="h-4 w-4" />
										<span className="text-sm">Latency</span>
									</div>
									<p className="text-2xl font-bold">
										{isLoading ? "—" : `${status?.latency ?? 0}ms`}
									</p>
								</div>
								<div className="rounded-xl bg-muted/50 p-4">
									<div className="flex items-center gap-2 text-muted-foreground mb-2">
										<Clock className="h-4 w-4" />
										<span className="text-sm">Uptime</span>
									</div>
									<p className="text-2xl font-bold">
										{isLoading ? "—" : formatUptime(status?.uptime ?? 0)}
									</p>
								</div>
							</div>
						)}

						{status?.lastRestart && (
							<p className="mt-6 text-sm text-muted-foreground text-center">
								Last restart: {format(new Date(status.lastRestart), "PPpp")}
							</p>
						)}
					</div>
				</FadeIn>

				{/* Statistics Grid */}
				<FadeIn className="mb-8">
					<h2 className="text-2xl font-bold text-center mb-8">Statistics</h2>
				</FadeIn>

				<StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
							label="Commands Run"
							value={stats?.commandsRun?.toLocaleString() ?? "—"}
							icon={Activity}
						/>
					</motion.div>
				</StaggerContainer>

				{/* Refresh Notice */}
				<FadeIn className="mt-12 text-center text-sm text-muted-foreground">
					<p>Status updates automatically every 30 seconds</p>
				</FadeIn>
			</div>
		</div>
	);
}
