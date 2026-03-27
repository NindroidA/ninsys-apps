import { useBaitJoinEvents } from "@/hooks/useBaitChannel";
import { Card } from "@ninsys/ui/components";
import { Activity } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BaitJoinVelocityTabProps {
	guildId: string;
}

const TIME_RANGES = [
	{ label: "1d", days: 1 },
	{ label: "3d", days: 3 },
	{ label: "7d", days: 7 },
	{ label: "14d", days: 14 },
	{ label: "30d", days: 30 },
];

interface HourlyBucket {
	time: string;
	count: number;
	burstCount: number;
}

export function BaitJoinVelocityTab({ guildId }: BaitJoinVelocityTabProps) {
	const [rangeDays, setRangeDays] = useState(7);
	const { data: events = [], isLoading } = useBaitJoinEvents(guildId, 500);

	const cutoff = useMemo(() => Date.now() - rangeDays * 24 * 60 * 60 * 1000, [rangeDays]);

	const filtered = useMemo(
		() => events.filter((e) => new Date(e.timestamp).getTime() >= cutoff),
		[events, cutoff],
	);

	const chartData = useMemo(() => {
		const buckets = new Map<string, HourlyBucket>();
		for (const event of filtered) {
			const d = new Date(event.timestamp);
			const key =
				rangeDays <= 3
					? `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`
					: `${d.getMonth() + 1}/${d.getDate()}`;
			const existing = buckets.get(key);
			if (existing) {
				existing.count++;
				if (event.isBurst) existing.burstCount++;
			} else {
				buckets.set(key, {
					time: key,
					count: 1,
					burstCount: event.isBurst ? 1 : 0,
				});
			}
		}
		return Array.from(buckets.values());
	}, [filtered, rangeDays]);

	const burstActive = filtered.some(
		(e) => e.isBurst && Date.now() - new Date(e.timestamp).getTime() < 5 * 60 * 1000,
	);

	const currentRate = useMemo(() => {
		const fiveMinAgo = Date.now() - 5 * 60 * 1000;
		return filtered.filter((e) => new Date(e.timestamp).getTime() >= fiveMinAgo).length;
	}, [filtered]);

	if (isLoading) {
		return (
			<div className="space-y-4 animate-pulse">
				<div className="h-8 w-40 rounded bg-muted" />
				<div className="h-64 rounded-lg bg-muted" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Status row */}
			<div className="flex items-center gap-4 flex-wrap">
				<div className="flex items-center gap-2">
					<Activity
						className={`h-4 w-4 ${
							burstActive ? "text-red-500 animate-pulse" : "text-muted-foreground"
						}`}
					/>
					<span className="text-sm">
						{burstActive ? (
							<span className="text-red-500 font-medium">Burst Detected</span>
						) : (
							<span className="text-muted-foreground">Normal</span>
						)}
					</span>
				</div>
				<span className="text-sm text-muted-foreground">
					Join rate: <span className="font-medium text-foreground">{currentRate}</span>
					/5min
				</span>
				<div className="flex-1" />
				{/* Time range buttons */}
				<div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
					{TIME_RANGES.map((r) => (
						<button
							key={r.days}
							type="button"
							onClick={() => setRangeDays(r.days)}
							className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
								rangeDays === r.days
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{r.label}
						</button>
					))}
				</div>
			</div>

			{/* Chart */}
			<Card className="p-6">
				<h3 className="text-sm font-semibold mb-4">Join Events</h3>
				{chartData.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-12">
						No join events in this time range
					</p>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={chartData}>
							<XAxis dataKey="time" tick={{ fontSize: 11 }} />
							<YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							<Area
								type="monotone"
								dataKey="count"
								stroke="oklch(0.55 0.12 240)"
								fill="oklch(0.55 0.20 280 / 0.15)"
								name="Joins"
							/>
							<Area
								type="monotone"
								dataKey="burstCount"
								stroke="#ef4444"
								fill="rgba(239, 68, 68, 0.15)"
								name="Burst Joins"
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="p-4">
					<p className="text-xs text-muted-foreground">Total Joins ({rangeDays}d)</p>
					<p className="text-xl font-bold mt-1">{filtered.length}</p>
				</Card>
				<Card className="p-4">
					<p className="text-xs text-muted-foreground">Burst Events</p>
					<p className="text-xl font-bold mt-1 text-red-500">
						{filtered.filter((e) => e.isBurst).length}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-xs text-muted-foreground">Avg/Day</p>
					<p className="text-xl font-bold mt-1">
						{rangeDays > 0 ? Math.round(filtered.length / rangeDays) : 0}
					</p>
				</Card>
			</div>
		</div>
	);
}
