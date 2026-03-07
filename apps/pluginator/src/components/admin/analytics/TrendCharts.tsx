/**
 * User growth area chart + download volume bar chart
 */

import type { AnalyticsPeriod } from "@/hooks/useAdminAnalytics";
import { useAdminTrends } from "@/hooks/useAdminAnalytics";
import {
	Area,
	AreaChart,
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface TrendChartsProps {
	period: AnalyticsPeriod;
}

function ChartTooltip({
	active,
	payload,
	label,
}: { active?: boolean; payload?: any[]; label?: string }) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-lg border border-border bg-card p-3 shadow-lg">
			<p className="text-sm font-medium mb-1">{label}</p>
			{payload.map((entry: any) => (
				<p key={entry.name} className="text-xs text-muted-foreground">
					{entry.name}:{" "}
					<span className="font-medium text-foreground">
						{entry.value.toLocaleString()}
					</span>
				</p>
			))}
		</div>
	);
}

export function TrendCharts({ period }: TrendChartsProps) {
	const { data, isLoading, error } = useAdminTrends(period);

	if (isLoading) {
		return (
			<div className="grid lg:grid-cols-2 gap-6">
				{[0, 1].map((i) => (
					<div
						key={`trend-skeleton-${i}`}
						className="rounded-xl border border-border bg-card p-6 h-80 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Failed to load trend data.
			</div>
		);
	}

	const signupData = data.buckets.map((label, i) => ({
		label,
		signups: data.signups[i] ?? 0,
		cumulative: data.signupsCumulative[i] ?? 0,
	}));

	const downloadData = data.buckets.map((label, i) => ({
		label,
		downloads: data.downloads[i] ?? 0,
		cumulative: data.downloadsCumulative[i] ?? 0,
	}));

	return (
		<div className="grid lg:grid-cols-2 gap-6">
			{/* User Growth */}
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-muted-foreground mb-4">
					User Growth
				</h3>
				<ResponsiveContainer width="100%" height={240}>
					<AreaChart data={signupData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 11 }}
							className="text-muted-foreground"
						/>
						<YAxis
							tick={{ fontSize: 11 }}
							className="text-muted-foreground"
						/>
						<Tooltip content={<ChartTooltip />} />
						<Area
							type="monotone"
							dataKey="signups"
							name="New Signups"
							fill="oklch(0.55 0.22 250 / 0.2)"
							stroke="oklch(0.55 0.22 250)"
							strokeWidth={2}
						/>
						<Line
							type="monotone"
							dataKey="cumulative"
							name="Total Users"
							stroke="oklch(0.65 0.05 250)"
							strokeWidth={1.5}
							strokeDasharray="4 4"
							dot={false}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Download Volume */}
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-muted-foreground mb-4">
					Download Volume
				</h3>
				<ResponsiveContainer width="100%" height={240}>
					<ComposedChart data={downloadData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 11 }}
							className="text-muted-foreground"
						/>
						<YAxis
							tick={{ fontSize: 11 }}
							className="text-muted-foreground"
						/>
						<Tooltip content={<ChartTooltip />} />
						<Bar
							dataKey="downloads"
							name="Downloads"
							fill="oklch(0.75 0.15 195 / 0.6)"
							radius={[4, 4, 0, 0]}
						/>
						<Line
							type="monotone"
							dataKey="cumulative"
							name="Cumulative"
							stroke="oklch(0.65 0.05 195)"
							strokeWidth={1.5}
							strokeDasharray="4 4"
							dot={false}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
