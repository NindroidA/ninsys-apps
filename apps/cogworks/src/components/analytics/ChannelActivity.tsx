import { Skeleton } from "@/components/ui/LoadingSkeleton";
import type { AnalyticsChannels } from "@/types/analytics";
import { Card } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { BarChart3, Hash, List } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChannelActivityProps {
	channels: AnalyticsChannels | null | undefined;
	isLoading: boolean;
	limit?: number;
}

type ViewMode = "table" | "chart";

export function ChannelActivity({ channels, isLoading, limit = 10 }: ChannelActivityProps) {
	const [view, setView] = useState<ViewMode>("table");

	const rows = useMemo(() => {
		if (!channels) return [];
		return channels.channels.slice(0, limit);
	}, [channels, limit]);

	const maxMessages = rows[0]?.messages ?? 0;

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Hash className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Top Channels</h3>
					{channels && (
						<span className="text-xs text-muted-foreground">Last {channels.days} days</span>
					)}
				</div>
				<div className="inline-flex items-center rounded-lg bg-muted/50 border border-border p-0.5">
					<ViewToggle
						active={view === "table"}
						onClick={() => setView("table")}
						icon={List}
						label="Table"
					/>
					<ViewToggle
						active={view === "chart"}
						onClick={() => setView("chart")}
						icon={BarChart3}
						label="Chart"
					/>
				</div>
			</div>

			{isLoading && (
				<div className="space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={`chskel-${i}`} className="h-10 w-full" />
					))}
				</div>
			)}

			{!isLoading && rows.length === 0 && (
				<div className="py-8 text-center text-sm text-muted-foreground">
					Channel activity will appear as messages are tracked.
				</div>
			)}

			{!isLoading && rows.length > 0 && view === "table" && (
				<div className="overflow-hidden">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border text-left">
								<th className="py-2 pr-4 font-medium text-muted-foreground">Channel</th>
								<th className="py-2 text-right font-medium text-muted-foreground">Messages</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((ch) => {
								const pct = maxMessages > 0 ? Math.round((ch.messages / maxMessages) * 100) : 0;
								return (
									<tr key={ch.channelId} className="border-b border-border/40">
										<td className="py-2 pr-4">
											<div className="flex items-center gap-1.5">
												<Hash className="h-3 w-3 text-muted-foreground shrink-0" />
												<span className="truncate">{ch.channelName}</span>
											</div>
											<div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
												<div
													className="h-full rounded-full bg-primary transition-[width]"
													style={{ width: `${pct}%` }}
												/>
											</div>
										</td>
										<td className="py-2 text-right font-medium tabular-nums">
											{ch.messages.toLocaleString()}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			{!isLoading && rows.length > 0 && view === "chart" && (
				<div className="h-72">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={rows}
							layout="vertical"
							margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								className="stroke-border"
								opacity={0.4}
								horizontal={false}
							/>
							<XAxis
								type="number"
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
								axisLine={{ stroke: "hsl(var(--border))" }}
								tickLine={{ stroke: "hsl(var(--border))" }}
								allowDecimals={false}
							/>
							<YAxis
								type="category"
								dataKey="channelName"
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
								axisLine={{ stroke: "hsl(var(--border))" }}
								tickLine={{ stroke: "hsl(var(--border))" }}
								width={110}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "0.5rem",
									fontSize: "0.875rem",
								}}
								formatter={(value) => [Number(value).toLocaleString(), "Messages"]}
							/>
							<Bar dataKey="messages" fill="oklch(0.55 0.20 280)" radius={[0, 4, 4, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</Card>
	);
}

interface ViewToggleProps {
	active: boolean;
	onClick: () => void;
	icon: typeof List;
	label: string;
}

function ViewToggle({ active, onClick, icon: Icon, label }: ViewToggleProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={active}
			className={cn(
				"inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors",
				active
					? "bg-background text-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground",
			)}
		>
			<Icon className="h-3.5 w-3.5" />
		</button>
	);
}
