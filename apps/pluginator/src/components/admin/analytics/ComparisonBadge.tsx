/**
 * Comparison badge showing percentage change vs previous period
 */

import { cn } from "@ninsys/ui/lib";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface ComparisonBadgeProps {
	current: number;
	previous: number;
	/** Set true when a decrease is good (e.g., error rate) */
	invertColor?: boolean;
}

export function ComparisonBadge({ current, previous, invertColor }: ComparisonBadgeProps) {
	if (previous === 0 && current === 0) {
		return (
			<span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
				<Minus className="h-3 w-3" />
				0%
			</span>
		);
	}

	const change = previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);

	const isPositive = change > 0;
	const isNeutral = change === 0;

	const colorClass = isNeutral
		? "text-muted-foreground"
		: isPositive !== invertColor
			? "text-emerald-500"
			: "text-red-500";

	const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;

	return (
		<span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", colorClass)}>
			<Icon className="h-3 w-3" />
			{Math.abs(change)}%
		</span>
	);
}
