import { Skeleton } from "@/components/ui/LoadingSkeleton";
import type { AnalyticsHours } from "@/types/analytics";
import { Card } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { Clock, Info } from "lucide-react";
import { useMemo } from "react";

interface ActivityHeatmapProps {
	hours: AnalyticsHours | null | undefined;
	isLoading: boolean;
}

function formatHour(hour: number): string {
	const h = hour % 24;
	if (h === 0) return "12 AM";
	if (h === 12) return "12 PM";
	if (h < 12) return `${h} AM`;
	return `${h - 12} PM`;
}

export function ActivityHeatmap({ hours, isLoading }: ActivityHeatmapProps) {
	const { maxMessages, peakHour } = useMemo(() => {
		if (!hours || hours.hourly.length === 0) {
			return { maxMessages: 0, peakHour: 0 };
		}
		const peak = hours.hourly.reduce((a, b) => (b.messages > a.messages ? b : a));
		const max = peak.messages;
		return { maxMessages: max, peakHour: peak.hour };
	}, [hours]);

	if (isLoading) {
		return (
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<Clock className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Activity by Hour</h3>
				</div>
				<Skeleton className="h-24 w-full" />
			</Card>
		);
	}

	if (!hours || hours.hourly.length === 0) {
		return (
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<Clock className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Activity by Hour</h3>
				</div>
				<div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
					Activity data will appear as messages are tracked.
				</div>
			</Card>
		);
	}

	const hasAnyActivity = maxMessages > 0;

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
				<div className="flex items-center gap-2">
					<Clock className="h-4 w-4 text-primary" />
					<h3 className="font-semibold">Activity by Hour</h3>
					<span className="text-xs text-muted-foreground">Last {hours.days} days</span>
				</div>
				{hasAnyActivity && (
					<div className="text-xs text-muted-foreground">
						Peak: <span className="font-medium text-foreground">{formatHour(peakHour)}</span>
					</div>
				)}
			</div>

			{/* Heatmap cells */}
			<div className="grid grid-cols-12 gap-1 mb-2">
				{hours.hourly.map((bucket) => (
					<HeatCell
						key={bucket.hour}
						hour={bucket.hour}
						messages={bucket.messages}
						max={maxMessages}
					/>
				))}
			</div>

			{/* Hour axis labels — show every 3 hours */}
			<div className="grid grid-cols-12 gap-1 text-[10px] text-muted-foreground">
				{hours.hourly.map((bucket) => (
					<div key={bucket.hour} className="text-center">
						{bucket.hour % 3 === 0 ? formatHour(bucket.hour) : ""}
					</div>
				))}
			</div>

			{/* Legend + UTC notice */}
			<div className="mt-4 flex items-center justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span>Less</span>
					<div className="flex gap-0.5">
						{[0.1, 0.3, 0.5, 0.75, 1].map((intensity) => (
							<div
								key={intensity}
								className="h-3 w-3 rounded-sm"
								style={{ backgroundColor: colorForIntensity(intensity) }}
							/>
						))}
					</div>
					<span>More</span>
				</div>
				<div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<Info className="h-3 w-3" />
					<span>Times shown in UTC</span>
				</div>
			</div>
		</Card>
	);
}

interface HeatCellProps {
	hour: number;
	messages: number;
	max: number;
}

function HeatCell({ hour, messages, max }: HeatCellProps) {
	const intensity = max > 0 ? messages / max : 0;
	const bg = intensity === 0 ? "hsl(var(--muted))" : colorForIntensity(intensity);
	const label = `${formatHour(hour)} · ${messages.toLocaleString()} messages`;

	return (
		<div
			className={cn(
				"aspect-square rounded-sm transition-transform hover:scale-110 cursor-help",
				intensity === 0 && "opacity-40",
			)}
			style={{ backgroundColor: bg }}
			title={label}
			aria-label={label}
		/>
	);
}

/**
 * Returns a color on a cool→warm gradient given an intensity value in [0, 1].
 * Uses Cogworks purple as the warm anchor so it ties to the brand.
 */
function colorForIntensity(intensity: number): string {
	// Clamp to [0, 1]
	const t = Math.max(0, Math.min(1, intensity));
	// Lightness: 0.85 (very light) → 0.45 (deep primary)
	const lightness = 0.85 - t * 0.4;
	// Chroma ramps up with intensity
	const chroma = 0.05 + t * 0.2;
	// Hue stays at primary purple
	return `oklch(${lightness} ${chroma} 280)`;
}
