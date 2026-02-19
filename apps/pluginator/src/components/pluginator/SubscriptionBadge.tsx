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
		className:
			"bg-gradient-to-r from-blue-400/25 via-blue-500/25 to-indigo-500/25 backdrop-blur-sm border border-blue-500/40 text-blue-400",
	},
	pro: {
		label: "Pro",
		className:
			"bg-gradient-to-r from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 backdrop-blur-sm border border-purple-500/40 text-purple-400",
	},
	max: {
		label: "Max",
		className:
			"bg-gradient-to-r from-amber-400/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 text-amber-400",
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
