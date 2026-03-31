import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminHealth } from "@/hooks/useAdmin";
import { useHealthHistory } from "@/hooks/useAdminEnhanced";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Database, Globe, Server } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

function statusColor(status: string | undefined): string {
	if (!status) return "text-muted-foreground";
	const s = status.toLowerCase();
	if (s === "healthy" || s === "online" || s === "ok" || s === "connected") return "text-green-500";
	if (s === "degraded" || s === "slow") return "text-yellow-500";
	return "text-red-500";
}

function statusDot(status: string | undefined): string {
	if (!status) return "bg-muted-foreground";
	const s = status.toLowerCase();
	if (s === "healthy" || s === "online" || s === "ok" || s === "connected") return "bg-green-500";
	if (s === "degraded" || s === "slow") return "bg-yellow-500";
	return "bg-red-500";
}

function HealthCard({
	title,
	icon: Icon,
	status,
	metrics,
	loading,
}: {
	title: string;
	icon: ComponentType<{ className?: string }>;
	status?: string;
	metrics: { label: string; value: string | number }[];
	loading?: boolean;
}) {
	if (loading) {
		return (
			<Card className="p-5 animate-pulse">
				<div className="h-5 w-32 rounded bg-muted mb-4" />
				<div className="space-y-3">
					<div className="h-4 w-full rounded bg-muted" />
					<div className="h-4 w-2/3 rounded bg-muted" />
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-5">
			<div className="flex items-center gap-3 mb-4">
				<Icon className="h-5 w-5 text-muted-foreground" />
				<h3 className="text-sm font-semibold flex-1">{title}</h3>
				{status && (
					<div className="flex items-center gap-1.5">
						<span className={cn("h-2 w-2 rounded-full", statusDot(status))} />
						<span className={cn("text-xs font-medium capitalize", statusColor(status))}>
							{status}
						</span>
					</div>
				)}
			</div>
			<div className="space-y-2">
				{metrics.map((m) => (
					<div key={m.label} className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">{m.label}</span>
						<span className="font-medium">{m.value}</span>
					</div>
				))}
			</div>
		</Card>
	);
}

function formatChartTime(timestamp: string): string {
	return new Date(timestamp).toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function AdminHealthPage() {
	usePageTitle("System Health \u2014 Admin");
	const { data: health, isLoading } = useAdminHealth();
	const { data: history } = useHealthHistory(24);

	const apiChartData = useMemo(
		() =>
			(history ?? []).map((snap) => ({
				time: formatChartTime(snap.createdAt),
				responseTime: snap.apiResponseTimeMs ?? 0,
			})),
		[history],
	);

	const botChartData = useMemo(
		() =>
			(history ?? []).map((snap) => ({
				time: formatChartTime(snap.createdAt),
				latency: snap.botLatencyMs ?? 0,
			})),
		[history],
	);

	const tooltipStyle = {
		backgroundColor: "hsl(var(--card))",
		border: "1px solid hsl(var(--border))",
		borderRadius: "8px",
		fontSize: "12px",
	};

	return (
		<FadeIn>
			<PageHeader title="System Health" description="API, bot, and database health monitoring" />

			<div className="space-y-6 max-w-5xl">
				{/* Health status cards */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<HealthCard
						title="API"
						icon={Globe}
						status={health?.api?.status}
						loading={isLoading}
						metrics={[
							{
								label: "Response Time",
								value:
									health?.api?.responseTimeMs != null ? `${health.api.responseTimeMs}ms` : "\u2014",
							},
						]}
					/>
					<HealthCard
						title="Bot"
						icon={Server}
						status={health?.bot?.status}
						loading={isLoading}
						metrics={[
							{
								label: "Gateway Latency",
								value:
									health?.bot?.gatewayLatency != null ? `${health.bot.gatewayLatency}ms` : "\u2014",
							},
							{
								label: "Shards",
								value: health?.bot?.shardCount ?? "\u2014",
							},
						]}
					/>
					<HealthCard
						title="Database"
						icon={Database}
						status={health?.database?.status}
						loading={isLoading}
						metrics={[
							{
								label: "Pool Size",
								value: health?.database?.poolSize ?? "\u2014",
							},
							{
								label: "Active Connections",
								value: health?.database?.activeConnections ?? "\u2014",
							},
						]}
					/>
				</div>

				{/* Response Time Charts */}
				{apiChartData.length > 0 && (
					<Card className="p-6">
						<h3 className="text-sm font-semibold mb-1">API Response Time</h3>
						<p className="text-xs text-muted-foreground mb-4">
							Response time in milliseconds over the last 24 hours
						</p>
						<ResponsiveContainer width="100%" height={240}>
							<AreaChart data={apiChartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
								<XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
								<YAxis
									tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
									unit="ms"
									allowDecimals={false}
								/>
								<Tooltip contentStyle={tooltipStyle} />
								<Area
									type="monotone"
									dataKey="responseTime"
									stroke="#3b82f6"
									fill="rgba(59, 130, 246, 0.12)"
									strokeWidth={2}
									name="Response Time (ms)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Card>
				)}

				{botChartData.length > 0 && (
					<Card className="p-6">
						<h3 className="text-sm font-semibold mb-1">Bot Gateway Latency</h3>
						<p className="text-xs text-muted-foreground mb-4">
							Gateway latency in milliseconds over the last 24 hours
						</p>
						<ResponsiveContainer width="100%" height={240}>
							<AreaChart data={botChartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
								<XAxis dataKey="time" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
								<YAxis
									tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
									unit="ms"
									allowDecimals={false}
								/>
								<Tooltip contentStyle={tooltipStyle} />
								<Area
									type="monotone"
									dataKey="latency"
									stroke="#8b5cf6"
									fill="rgba(139, 92, 246, 0.12)"
									strokeWidth={2}
									name="Gateway Latency (ms)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Card>
				)}

				{apiChartData.length === 0 && botChartData.length === 0 && !isLoading && (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<p className="text-muted-foreground">No health history data available</p>
					</div>
				)}
			</div>
		</FadeIn>
	);
}
