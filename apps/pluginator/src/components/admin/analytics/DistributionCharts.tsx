/**
 * 3 donut charts: tier, auth method, role distributions
 */

import type { DistributionEntry } from "@/hooks/useAdminAnalytics";
import { useAdminDistributions } from "@/hooks/useAdminAnalytics";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const TIER_COLORS: Record<string, string> = {
	free: "#6b7280",
	plus: "#3b82f6",
	pro: "#a855f7",
	max: "#f59e0b",
};

const AUTH_COLORS: Record<string, string> = {
	email: "#3b82f6",
	google: "#ea4335",
	github: "#8b5cf6",
};

const ROLE_COLORS: Record<string, string> = {
	user: "#6b7280",
	developer: "#3b82f6",
	admin: "#a855f7",
	super_admin: "#f59e0b",
};

interface DonutCardProps {
	title: string;
	data: DistributionEntry[];
	colors: Record<string, string>;
}

function DonutCard({ title, data, colors }: DonutCardProps) {
	const safeData = data.filter((d) => d.name != null);
	const total = safeData.reduce((sum, d) => sum + d.value, 0);

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h3 className="text-sm font-semibold text-muted-foreground mb-4">{title}</h3>
			<div className="flex items-center gap-6">
				<div className="w-32 h-32 shrink-0">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={35}
								outerRadius={55}
								dataKey="value"
								strokeWidth={2}
								className="stroke-card"
							>
								{safeData.map((entry) => (
									<Cell key={entry.name} fill={colors[entry.name] ?? "#6b7280"} />
								))}
							</Pie>
							<text
								x="50%"
								y="50%"
								textAnchor="middle"
								dominantBaseline="central"
								className="fill-foreground text-lg font-bold"
							>
								{total.toLocaleString()}
							</text>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="flex-1 space-y-2">
					{data.map((entry) => {
						const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
						return (
							<div key={entry.name} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<div
										className="h-2.5 w-2.5 rounded-full shrink-0"
										style={{
											backgroundColor: colors[entry.name] ?? "#6b7280",
										}}
									/>
									<span className="capitalize">{entry.name.replace("_", " ")}</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground">
									<span>{entry.value.toLocaleString()}</span>
									<span className="text-xs">({pct}%)</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function DistributionCharts() {
	const { data, isLoading, error } = useAdminDistributions();

	if (isLoading) {
		return (
			<div className="grid md:grid-cols-3 gap-6">
				{[0, 1, 2].map((i) => (
					<div
						key={`dist-skeleton-${i}`}
						className="rounded-xl border border-border bg-card p-6 h-48 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center py-8 text-muted-foreground">Failed to load distributions.</div>
		);
	}

	return (
		<div className="grid md:grid-cols-3 gap-6">
			<DonutCard title="Tier Distribution" data={data.tiers} colors={TIER_COLORS} />
			<DonutCard title="Auth Methods" data={data.authMethods} colors={AUTH_COLORS} />
			<DonutCard title="User Roles" data={data.roles} colors={ROLE_COLORS} />
		</div>
	);
}
