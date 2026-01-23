/**
 * Usage Dashboard Component
 * Displays daily usage statistics and limits
 */

import { Card } from "@ninsys/ui/components";
import { useUsage } from "@/hooks/useUsage";
import { useSubscription } from "@/hooks/useSubscription";
import { TIER_DISPLAY, type UsageStat } from "@/types/tier";
import { AlertTriangle, Download, RefreshCw, Zap } from "lucide-react";

export function UsageDashboard() {
	const { data: usage, isLoading: usageLoading } = useUsage();
	const { data: subscription } = useSubscription();

	if (usageLoading || !usage) {
		return <UsageSkeleton />;
	}

	const tierInfo = TIER_DISPLAY[usage.tier];

	return (
		<div className="space-y-6">
			{/* Current Tier */}
			<Card className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">Your Plan</h3>
						{subscription?.hasPlusDiscount && usage.tier !== "plus" && (
							<p className="text-sm text-success">Plus discount applied</p>
						)}
					</div>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium bg-${tierInfo.color}-100 text-${tierInfo.color}-800 dark:bg-${tierInfo.color}-900/30 dark:text-${tierInfo.color}-400`}
					>
						{tierInfo.name}
					</span>
				</div>
			</Card>

			{/* Usage Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<UsageCard
					title="Update Checks"
					icon={<Zap className="h-4 w-4" />}
					stat={usage.today.checks}
				/>
				<UsageCard
					title="Downloads"
					icon={<Download className="h-4 w-4" />}
					stat={usage.today.downloads}
				/>
				<UsageCard
					title="Syncs"
					icon={<RefreshCw className="h-4 w-4" />}
					stat={usage.today.syncs}
				/>
			</div>

			{/* Low Usage Warning */}
			{(isLowUsage(usage.today.checks) ||
				isLowUsage(usage.today.downloads) ||
				isLowUsage(usage.today.syncs)) && (
				<Card className="p-4 border-warning/50 bg-warning/5">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
						<p className="text-sm text-warning">
							You're running low on daily usage. Consider upgrading for higher
							limits.
						</p>
					</div>
				</Card>
			)}
		</div>
	);
}

interface UsageCardProps {
	title: string;
	icon: React.ReactNode;
	stat: UsageStat;
}

function UsageCard({ title, icon, stat }: UsageCardProps) {
	const isUnlimited = stat.limit === -1;
	const percentage = isUnlimited ? 0 : (stat.used / stat.limit) * 100;
	const isWarning = !isUnlimited && percentage >= 80;
	const isDanger = !isUnlimited && percentage >= 100;

	return (
		<Card
			className={`p-4 ${isDanger ? "border-destructive/50" : isWarning ? "border-warning/50" : ""}`}
		>
			<div className="flex items-center gap-2 text-muted-foreground mb-2">
				{icon}
				<span className="text-sm font-medium">{title}</span>
			</div>
			<div className="text-2xl font-bold">
				{stat.used}
				<span className="text-muted-foreground text-sm font-normal">
					{isUnlimited ? " / Unlimited" : ` / ${stat.limit}`}
				</span>
			</div>
			{!isUnlimited && (
				<div className="mt-2">
					<div className="h-2 bg-muted rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${
								isDanger
									? "bg-destructive"
									: isWarning
										? "bg-warning"
										: "bg-primary"
							}`}
							style={{ width: `${Math.min(100, percentage)}%` }}
						/>
					</div>
				</div>
			)}
			<p className="text-xs text-muted-foreground mt-1">
				{isUnlimited ? "No limit" : `${stat.remaining} remaining today`}
			</p>
		</Card>
	);
}

function isLowUsage(stat: UsageStat): boolean {
	if (stat.limit === -1) return false;
	return stat.remaining <= Math.ceil(stat.limit * 0.2);
}

function UsageSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-24 bg-muted rounded-xl" />
			<div className="grid gap-4 md:grid-cols-3">
				<div className="h-32 bg-muted rounded-xl" />
				<div className="h-32 bg-muted rounded-xl" />
				<div className="h-32 bg-muted rounded-xl" />
			</div>
		</div>
	);
}
