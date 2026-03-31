import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminHealth, useAdminOverview } from "@/hooks/useAdmin";
import { useAdminActivity, useServerGrowth } from "@/hooks/useAdminEnhanced";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import {
	Activity,
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	Clock,
	Cpu,
	Gauge,
	Minus,
	Radio,
	Server,
	ServerCrash,
	Shield,
	Terminal,
	Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";

function StatCard({
	label,
	value,
	icon: Icon,
	loading,
	accent,
}: {
	label: string;
	value: string | number;
	icon: ComponentType<{ className?: string }>;
	loading?: boolean;
	accent?: boolean;
}) {
	if (loading) {
		return (
			<Card className="p-5 animate-pulse">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-lg bg-muted" />
					<div>
						<div className="h-6 w-16 rounded bg-muted mb-1" />
						<div className="h-3 w-20 rounded bg-muted" />
					</div>
				</div>
			</Card>
		);
	}
	return (
		<Card className={cn("p-5", accent && "border-primary/20")}>
			<div className="flex items-center gap-4">
				<div
					className={cn(
						"h-11 w-11 rounded-xl flex items-center justify-center",
						accent ? "bg-gradient-to-br from-primary/20 to-accent/10" : "bg-primary/10",
					)}
				>
					<Icon className={cn("h-5 w-5", accent ? "text-primary" : "text-primary")} />
				</div>
				<div>
					<p className="text-2xl font-bold tracking-tight">{value}</p>
					<p className="text-xs text-muted-foreground">{label}</p>
				</div>
			</div>
		</Card>
	);
}

function formatUptime(seconds: number): string {
	if (!seconds || seconds <= 0) return "\u2014";
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${mins}m`;
	return `${mins}m`;
}

function statusDot(status: string | undefined): string {
	if (!status) return "bg-muted-foreground";
	const s = status.toLowerCase();
	if (s === "healthy" || s === "online" || s === "ok" || s === "connected") return "bg-green-500";
	if (s === "degraded" || s === "slow") return "bg-yellow-500";
	return "bg-red-500";
}

function formatRelativeTime(timestamp: string): string {
	const now = Date.now();
	const then = new Date(timestamp).getTime();
	const diffMs = now - then;
	const diffSec = Math.floor(diffMs / 1000);
	if (diffSec < 60) return "just now";
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	return `${diffDay}d ago`;
}

const QUICK_ACTIONS = [
	{ label: "Set Status Override", to: "/admin/bot-status", icon: Radio },
	{ label: "View Servers", to: "/admin/servers", icon: Server },
	{ label: "Error Logs", to: "/admin/errors", icon: ServerCrash },
	{ label: "Rate Limits", to: "/admin/rate-limits", icon: Gauge },
] as const;

const ACTIVITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
	command: Terminal,
	join: Server,
	leave: ServerCrash,
	error: AlertTriangle,
	config: Shield,
};

export function AdminDashboardPage() {
	usePageTitle("Super Admin");
	const { data: overview, isLoading } = useAdminOverview();
	const { data: health } = useAdminHealth();
	const { data: growth, isLoading: growthLoading } = useServerGrowth(7);
	const { data: activity, isLoading: activityLoading } = useAdminActivity(10);

	return (
		<FadeIn>
			<PageHeader title="Super Admin Dashboard" description="Bot-wide overview and management" />

			<div className="space-y-6 max-w-5xl">
				{!isLoading && !overview && (
					<Card className="p-4 border-amber-500/30 bg-amber-500/5">
						<p className="text-sm text-amber-300">
							Unable to load admin data. Make sure{" "}
							<code className="font-mono text-xs bg-amber-500/10 px-1 py-0.5 rounded">
								COGWORKS_BOT_OWNER_ID
							</code>{" "}
							is set in the API environment and matches your Discord user ID.
						</p>
					</Card>
				)}

				{/* Primary stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<StatCard
						label="Servers"
						value={overview?.serverCount ?? "\u2014"}
						icon={Server}
						loading={isLoading}
						accent
					/>
					<StatCard
						label="Commands (24h)"
						value={overview?.commandsRun24h?.toLocaleString() ?? "\u2014"}
						icon={Terminal}
						loading={isLoading}
					/>
					<StatCard
						label="Uptime"
						value={overview ? formatUptime(overview.uptimeSeconds) : "\u2014"}
						icon={Clock}
						loading={isLoading}
					/>
				</div>

				{/* Performance stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<StatCard
						label="Gateway Latency"
						value={overview?.latencyMs != null ? `${overview.latencyMs}ms` : "\u2014"}
						icon={Zap}
						loading={isLoading}
					/>
					<StatCard
						label="Memory Usage"
						value={
							overview?.memoryUsageMb != null ? `${Math.round(overview.memoryUsageMb)}MB` : "\u2014"
						}
						icon={Cpu}
						loading={isLoading}
					/>
					<StatCard
						label="Bot Version"
						value={overview?.botVersion ?? "\u2014"}
						icon={Activity}
						loading={isLoading}
					/>
				</div>

				{/* Quick health status */}
				{health && (
					<Card className="p-5">
						<h3 className="text-sm font-semibold mb-3">System Status</h3>
						<div className="flex items-center gap-6">
							{[
								{ label: "API", status: health.api?.status },
								{ label: "Bot", status: health.bot?.status },
								{ label: "Database", status: health.database?.status },
							].map((s) => (
								<div key={s.label} className="flex items-center gap-2">
									<span className={cn("h-2 w-2 rounded-full", statusDot(s.status))} />
									<span className="text-sm text-muted-foreground">{s.label}</span>
									<span className="text-sm font-medium capitalize">{s.status ?? "\u2014"}</span>
								</div>
							))}
						</div>
					</Card>
				)}

				{/* Quick Actions */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{QUICK_ACTIONS.map((action) => {
						const ActionIcon = action.icon;
						return (
							<Link key={action.to} to={action.to}>
								<Card className="p-4 hover:border-primary/30 hover:bg-primary/[0.03] transition-colors cursor-pointer group">
									<div className="flex items-center gap-3">
										<ActionIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
										<span className="text-sm font-medium">{action.label}</span>
									</div>
								</Card>
							</Link>
						);
					})}
				</div>

				{/* Server Growth + Activity Feed */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Server Growth Card */}
					<Card className="p-5">
						<h3 className="text-sm font-semibold mb-1">Server Growth</h3>
						<p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
						{growthLoading ? (
							<div className="animate-pulse space-y-2">
								<div className="h-8 w-32 rounded bg-muted" />
								<div className="h-4 w-48 rounded bg-muted" />
							</div>
						) : !growth ? (
							<p className="text-sm text-muted-foreground">No growth data available</p>
						) : (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									{growth.net > 0 ? (
										<ArrowUp className="h-5 w-5 text-green-500" />
									) : growth.net < 0 ? (
										<ArrowDown className="h-5 w-5 text-red-500" />
									) : (
										<Minus className="h-5 w-5 text-muted-foreground" />
									)}
									<span
										className={cn(
											"text-2xl font-bold",
											growth.net > 0
												? "text-green-500"
												: growth.net < 0
													? "text-red-500"
													: "text-muted-foreground",
										)}
									>
										{growth.net > 0 ? "+" : ""}
										{growth.net}
									</span>
									<span className="text-sm text-muted-foreground">net</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{growth.added} server{growth.added !== 1 ? "s" : ""} added, {growth.removed}{" "}
									removed
								</p>
							</div>
						)}
					</Card>

					{/* Recent Activity Feed */}
					<Card className="p-5">
						<h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
						{activityLoading ? (
							<div className="animate-pulse space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={`skel-${i}`} className="flex items-center gap-3">
										<div className="h-7 w-7 rounded-full bg-muted" />
										<div className="flex-1">
											<div className="h-3 w-full rounded bg-muted mb-1" />
											<div className="h-2 w-20 rounded bg-muted" />
										</div>
									</div>
								))}
							</div>
						) : !activity || activity.length === 0 ? (
							<p className="text-sm text-muted-foreground">No recent activity</p>
						) : (
							<div className="space-y-3 max-h-64 overflow-y-auto pr-1">
								{activity.map((event, i) => {
									const EventIcon = ACTIVITY_ICONS[event.type] ?? Activity;
									return (
										<div key={`${event.timestamp}-${i}`} className="flex items-start gap-3">
											<div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
												<EventIcon className="h-3.5 w-3.5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm leading-snug truncate">{event.description}</p>
												<div className="flex items-center gap-2 mt-0.5">
													{event.guildName && (
														<span className="text-xs text-muted-foreground truncate">
															{event.guildName}
														</span>
													)}
													<span className="text-xs text-muted-foreground/60">
														{formatRelativeTime(event.timestamp)}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</Card>
				</div>
			</div>
		</FadeIn>
	);
}
