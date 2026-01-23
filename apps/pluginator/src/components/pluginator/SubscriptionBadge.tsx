import type { Tier } from "@/types/tier";
import { cn } from "@ninsys/ui/lib";

interface SubscriptionBadgeProps {
	tier: Tier;
	className?: string;
}

const tierConfig: Record<Tier, { label: string; className: string }> = {
	free: {
		label: "Free",
		className: "bg-muted text-muted-foreground",
	},
	plus: {
		label: "Plus",
		className: "bg-blue-500 text-white",
	},
	pro: {
		label: "Pro",
		className: "pro-gradient text-white",
	},
	max: {
		label: "Max",
		className: "bg-amber-500 text-white",
	},
};

export function SubscriptionBadge({ tier, className }: SubscriptionBadgeProps) {
	const config = tierConfig[tier];

	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
				config.className,
				className,
			)}
		>
			{config.label}
		</span>
	);
}
