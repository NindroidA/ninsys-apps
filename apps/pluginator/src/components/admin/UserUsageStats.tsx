/**
 * Usage stats card for admin user detail page
 * Shows per-user download/activity breakdown with daily chart
 */

import { useAdminUserUsageStats } from "@/hooks/useAdminAnalytics";
import { Loader2 } from "lucide-react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface UserUsageStatsProps {
	userId: string;
}

export function UserUsageStats({ userId }: UserUsageStatsProps) {
	const { data, isLoading, error } = useAdminUserUsageStats(userId, "30d");

	if (isLoading) {
		return (
			<div className="rounded-xl border border-border bg-card p-6">
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span className="text-sm text-muted-foreground">
						Loading usage stats...
					</span>
				</div>
			</div>
		);
	}

	if (error || !data) return null;

	const stats = [
		{ label: "Downloads", value: data.downloads },
		{ label: "Update Checks", value: data.updateChecks },
		{ label: "Syncs", value: data.syncs },
		{ label: "Migrations", value: data.migrations },
	];

	const total = stats.reduce((sum, s) => sum + s.value, 0);

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h3 className="text-lg font-semibold mb-4">Usage Stats (Last 30 Days)</h3>

			{/* Stat grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
				{stats.map((s) => (
					<div key={s.label}>
						<p className="text-xs text-muted-foreground">{s.label}</p>
						<p className="text-xl font-bold">{s.value.toLocaleString()}</p>
					</div>
				))}
			</div>

			{/* Daily activity chart */}
			{total > 0 && data.dailyActivity.length > 0 && (
				<div>
					<p className="text-xs text-muted-foreground mb-2">Daily Activity</p>
					<ResponsiveContainer width="100%" height={120}>
						<BarChart data={data.dailyActivity}>
							<XAxis
								dataKey="date"
								tick={{ fontSize: 10 }}
								className="text-muted-foreground"
							/>
							<YAxis hide />
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							<Bar
								dataKey="actions"
								fill="oklch(0.55 0.22 250 / 0.6)"
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
