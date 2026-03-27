import { Badge } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";

const DEFAULT_COLORS: Record<string, string> = {
	open: "bg-green-500",
	active: "bg-green-500",
	online: "bg-green-500",
	approved: "bg-green-500",
	operational: "bg-green-500",
	pending: "bg-yellow-500",
	idle: "bg-yellow-500",
	degraded: "bg-yellow-500",
	closed: "bg-muted-foreground",
	denied: "bg-red-500",
	offline: "bg-red-500",
	archived: "bg-muted-foreground",
	partial_outage: "bg-orange-500",
	major_outage: "bg-red-500",
	maintenance: "bg-blue-500",
};

interface StatusBadgeProps {
	status: string;
	colorMap?: Record<string, string>;
	className?: string;
}

export function StatusBadge({ status, colorMap, className }: StatusBadgeProps) {
	const dotColor = colorMap?.[status] ?? DEFAULT_COLORS[status] ?? "bg-muted-foreground";
	const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

	return (
		<Badge variant="outline" className={cn("gap-1.5 capitalize", className)}>
			<span className={cn("h-2 w-2 rounded-full", dotColor)} />
			{label}
		</Badge>
	);
}
