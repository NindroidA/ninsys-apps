/**
 * Top 10 users by downloads and by overall activity
 */

import type { AnalyticsPeriod, LeaderboardEntry } from "@/hooks/useAdminAnalytics";
import { useAdminLeaderboards } from "@/hooks/useAdminAnalytics";
import { TIER_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@ninsys/ui/lib";
import { Link } from "react-router-dom";

interface LeaderboardTableProps {
	title: string;
	entries: LeaderboardEntry[];
	countLabel: string;
}

function LeaderboardTable({ title, entries, countLabel }: LeaderboardTableProps) {
	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h3 className="text-sm font-semibold text-muted-foreground mb-4">{title}</h3>
			{entries.length === 0 ? (
				<p className="text-sm text-muted-foreground py-4">No data for this period.</p>
			) : (
				<div className="space-y-1">
					{/* Header */}
					<div className="grid grid-cols-[2rem_1fr_4rem_3.5rem] gap-2 px-2 py-1 text-xs text-muted-foreground font-medium">
						<span>#</span>
						<span>User</span>
						<span className="text-right">{countLabel}</span>
						<span className="text-right">Tier</span>
					</div>
					{entries.map((entry, i) => (
						<Link
							key={entry.userId}
							to={`/admin/users/${entry.userId}`}
							className="grid grid-cols-[2rem_1fr_4rem_3.5rem] gap-2 px-2 py-2 rounded-lg hover:bg-muted transition-colors items-center"
						>
							<span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
										{(entry.name ?? entry.email)[0]?.toUpperCase()}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium truncate">{entry.name ?? entry.email}</p>
										{entry.name && (
											<p className="text-xs text-muted-foreground truncate">{entry.email}</p>
										)}
									</div>
								</div>
							</div>
							<span className="text-sm font-semibold text-right">
								{entry.count.toLocaleString()}
							</span>
							<span
								className={cn(
									"text-xs font-medium px-1.5 py-0.5 rounded text-right capitalize",
									TIER_BADGE_CLASSES[entry.tier] ?? TIER_BADGE_CLASSES.free,
								)}
							>
								{entry.tier}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}

interface LeaderboardsProps {
	period: AnalyticsPeriod;
}

export function Leaderboards({ period }: LeaderboardsProps) {
	const { data, isLoading, error } = useAdminLeaderboards(period);

	if (isLoading) {
		return (
			<div className="grid lg:grid-cols-2 gap-6">
				{[0, 1].map((i) => (
					<div
						key={`lb-skeleton-${i}`}
						className="rounded-xl border border-border bg-card p-6 h-96 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center py-8 text-muted-foreground">Failed to load leaderboards.</div>
		);
	}

	return (
		<div className="grid lg:grid-cols-2 gap-6">
			<LeaderboardTable
				title="Top Users by Downloads"
				entries={data.topDownloads}
				countLabel="DLs"
			/>
			<LeaderboardTable
				title="Top Users by Activity"
				entries={data.topActivity}
				countLabel="Actions"
			/>
		</div>
	);
}
