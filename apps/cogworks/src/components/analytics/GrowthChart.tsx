import { Skeleton } from "@/components/ui/LoadingSkeleton";
import type { AnalyticsGrowth, AnalyticsPeriod, GrowthPoint } from "@/types/analytics";
import { Card } from "@ninsys/ui/components";
import { addDays, format, parseISO, subDays } from "date-fns";
import { TrendingUp } from "lucide-react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface GrowthChartProps {
	growth: AnalyticsGrowth | null | undefined;
	period: AnalyticsPeriod;
	isLoading: boolean;
}

/**
 * Fills in any missing days in the growth data with zeros for joins/leaves.
 * totalMembers is carried forward from the last known value.
 */
function zeroFillGrowth(data: GrowthPoint[], days: number): GrowthPoint[] {
	const today = new Date();
	const start = subDays(today, days - 1);
	const byDate = new Map(data.map((p) => [p.date, p]));
	const result: GrowthPoint[] = [];
	let lastTotal = data[0]?.totalMembers ?? 0;

	for (let i = 0; i < days; i++) {
		const date = format(addDays(start, i), "yyyy-MM-dd");
		const point = byDate.get(date);
		if (point) {
			lastTotal = point.totalMembers;
			result.push(point);
		} else {
			result.push({ date, joins: 0, leaves: 0, totalMembers: lastTotal });
		}
	}

	return result;
}

function formatTickDate(date: string): string {
	try {
		return format(parseISO(date), "MMM d");
	} catch {
		return date;
	}
}

export function GrowthChart({ growth, period, isLoading }: GrowthChartProps) {
	if (isLoading) {
		return (
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Member Growth</h3>
				</div>
				<Skeleton className="h-64 w-full" />
			</Card>
		);
	}

	if (!growth || growth.data.length === 0) {
		return (
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Member Growth</h3>
				</div>
				<div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
					Growth data will appear as it is collected.
				</div>
			</Card>
		);
	}

	const filled = zeroFillGrowth(growth.data, period);

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-4">
				<TrendingUp className="h-4 w-4 text-primary" />
				<h3 className="font-semibold">Member Growth</h3>
				<span className="text-xs text-muted-foreground">Last {period} days · UTC</span>
			</div>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={filled} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} />
						<XAxis
							dataKey="date"
							tickFormatter={formatTickDate}
							className="text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))" }}
							axisLine={{ stroke: "hsl(var(--border))" }}
							tickLine={{ stroke: "hsl(var(--border))" }}
							minTickGap={20}
						/>
						<YAxis
							yAxisId="left"
							className="text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))" }}
							axisLine={{ stroke: "hsl(var(--border))" }}
							tickLine={{ stroke: "hsl(var(--border))" }}
							allowDecimals={false}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							className="text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))" }}
							axisLine={{ stroke: "hsl(var(--border))" }}
							tickLine={{ stroke: "hsl(var(--border))" }}
							allowDecimals={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "0.5rem",
								fontSize: "0.875rem",
							}}
							labelFormatter={(label) => formatTickDate(String(label))}
						/>
						<Legend
							wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
							iconType="circle"
						/>
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="joins"
							name="Joins"
							stroke="oklch(0.72 0.17 150)"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4 }}
						/>
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="leaves"
							name="Leaves"
							stroke="oklch(0.68 0.20 25)"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4 }}
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="totalMembers"
							name="Total Members"
							stroke="oklch(0.55 0.20 280)"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
