import { Skeleton } from "@/components/ui/LoadingSkeleton";
import type { AnalyticsDelta, AnalyticsOverview } from "@/types/analytics";
import { Card } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import {
	ArrowDown,
	ArrowUp,
	type LucideIcon,
	MessageSquare,
	Mic,
	Minus,
	UserMinus,
	UserPlus,
	Users,
} from "lucide-react";

interface KpiCardsProps {
	overview: AnalyticsOverview | null | undefined;
	isLoading: boolean;
}

interface KpiDefinition {
	key: keyof AnalyticsOverview["comparedToPrevious"];
	label: string;
	icon: LucideIcon;
	iconClass: string;
	format: (value: number) => string;
}

const KPI_CARDS: KpiDefinition[] = [
	{
		key: "messages",
		label: "Messages",
		icon: MessageSquare,
		iconClass: "text-primary",
		format: (v) => v.toLocaleString(),
	},
	{
		key: "activeMembers",
		label: "Active Members",
		icon: Users,
		iconClass: "text-primary",
		format: (v) => v.toLocaleString(),
	},
	{
		key: "joins",
		label: "Joins",
		icon: UserPlus,
		iconClass: "text-green-500",
		format: (v) => v.toLocaleString(),
	},
	{
		key: "leaves",
		label: "Leaves",
		icon: UserMinus,
		iconClass: "text-red-500",
		format: (v) => v.toLocaleString(),
	},
	{
		key: "voiceMinutes",
		label: "Voice Hours",
		icon: Mic,
		iconClass: "text-primary",
		format: (v) => Math.round(v / 60).toLocaleString(),
	},
];

export function KpiCards({ overview, isLoading }: KpiCardsProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
				{KPI_CARDS.map((kpi) => (
					<Card key={kpi.key} className="p-4">
						<Skeleton className="h-4 w-20 mb-2" />
						<Skeleton className="h-7 w-16 mb-2" />
						<Skeleton className="h-4 w-12" />
					</Card>
				))}
			</div>
		);
	}

	if (!overview) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
				{KPI_CARDS.map((kpi) => {
					const Icon = kpi.icon;
					return (
						<Card key={kpi.key} className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<Icon className={cn("h-4 w-4", kpi.iconClass)} />
								<span className="text-xs text-muted-foreground">{kpi.label}</span>
							</div>
							<p className="text-xl font-bold text-muted-foreground/50">—</p>
						</Card>
					);
				})}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
			{KPI_CARDS.map((kpi) => {
				const Icon = kpi.icon;
				const value = overview[kpi.key] as number;
				const delta = overview.comparedToPrevious[kpi.key];
				return (
					<Card key={kpi.key} className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Icon className={cn("h-4 w-4", kpi.iconClass)} />
							<span className="text-xs text-muted-foreground">{kpi.label}</span>
						</div>
						<p className="text-xl font-bold">{kpi.format(value)}</p>
						<div className="mt-1">
							<DeltaBadge delta={delta} />
						</div>
					</Card>
				);
			})}
		</div>
	);
}

interface DeltaBadgeProps {
	delta: AnalyticsDelta;
}

/**
 * Renders a delta string ("+12%", "-3%", "0%", "—") with appropriate color/icon.
 */
function DeltaBadge({ delta }: DeltaBadgeProps) {
	const trimmed = delta.trim();
	const first = trimmed.charAt(0);

	// Em-dash or not parseable → neutral placeholder
	if (first === "—" || trimmed === "") {
		return (
			<span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground/60">
				<Minus className="h-3 w-3" />
				<span>—</span>
			</span>
		);
	}

	let tone: "up" | "down" | "flat";
	if (first === "+") tone = "up";
	else if (first === "-") tone = "down";
	else tone = "flat"; // "0%" or anything else

	const toneClass =
		tone === "up" ? "text-green-500" : tone === "down" ? "text-red-500" : "text-muted-foreground";

	const Arrow = tone === "up" ? ArrowUp : tone === "down" ? ArrowDown : Minus;

	return (
		<span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", toneClass)}>
			<Arrow className="h-3 w-3" />
			<span>{trimmed}</span>
		</span>
	);
}
