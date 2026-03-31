import { PageHeader } from "@/components/dashboard/PageHeader";
import { useRateLimits } from "@/hooks/useAdminEnhanced";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Gauge, Loader2 } from "lucide-react";

function usageColor(pct: number): { bar: string; text: string } {
	if (pct > 80) return { bar: "bg-red-500", text: "text-red-400" };
	if (pct > 50) return { bar: "bg-yellow-500", text: "text-yellow-400" };
	return { bar: "bg-green-500", text: "text-green-400" };
}

export function AdminRateLimitsPage() {
	usePageTitle("Rate Limits \u2014 Admin");
	const { data: limits, isLoading } = useRateLimits();

	return (
		<FadeIn>
			<PageHeader title="Rate Limits" description="API rate limit usage across endpoints" />

			<div className="space-y-4 max-w-5xl">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					</div>
				) : !limits || limits.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<Gauge className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
						<p className="text-muted-foreground">Rate limit data not available</p>
					</div>
				) : (
					<Card className="divide-y divide-border overflow-hidden">
						{/* Table header */}
						<div className="grid grid-cols-[120px_1fr_120px_80px_1fr] gap-3 px-4 py-2.5 bg-muted/30 text-xs font-medium text-muted-foreground">
							<span>Category</span>
							<span>Last Reset</span>
							<span>Used / Limit</span>
							<span>Remaining</span>
							<span>Usage</span>
						</div>

						{/* Rows */}
						{limits.map((entry, i) => {
							const pct = entry.limit > 0 ? (entry.used / entry.limit) * 100 : 0;
							const colors = usageColor(pct);
							return (
								<div
									key={`${entry.category}-${i}`}
									className="grid grid-cols-[120px_1fr_120px_80px_1fr] gap-3 px-4 py-3 items-center hover:bg-muted/20 transition-colors"
								>
									<span className="text-sm font-medium capitalize truncate">{entry.category}</span>
									<span className="text-sm text-muted-foreground truncate">
										{entry.lastReset
											? new Date(entry.lastReset).toLocaleTimeString(undefined, {
													hour: "2-digit",
													minute: "2-digit",
												})
											: "\u2014"}
									</span>
									<span className="text-sm tabular-nums">
										{entry.used} <span className="text-muted-foreground">/ {entry.limit}</span>
									</span>
									<span className={cn("text-sm font-medium tabular-nums", colors.text)}>
										{entry.remaining}
									</span>
									<div className="flex items-center gap-3">
										<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
											<div
												className={cn(
													"h-full rounded-full transition-[width] duration-300",
													colors.bar,
												)}
												style={{ width: `${Math.min(pct, 100)}%` }}
											/>
										</div>
										<span
											className={cn(
												"text-xs font-medium tabular-nums w-10 text-right",
												colors.text,
											)}
										>
											{Math.round(pct)}%
										</span>
									</div>
								</div>
							);
						})}
					</Card>
				)}
			</div>
		</FadeIn>
	);
}
