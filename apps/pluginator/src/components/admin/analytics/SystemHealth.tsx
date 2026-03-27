/**
 * System health: session overview + security/adoption metrics
 */

import { useAdminSystemHealth } from "@/hooks/useAdminAnalytics";
import { cn } from "@ninsys/ui/lib";

function ProgressBar({
	value,
	max,
	className,
}: { value: number; max: number; className?: string }) {
	const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
	return (
		<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
			<div
				className={cn("h-full rounded-full transition-all", className ?? "bg-primary")}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
}

function StatRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
	return (
		<div className="flex items-center justify-between py-2">
			<span className="text-sm text-muted-foreground">{label}</span>
			<div className="text-right">
				<span className="text-sm font-semibold">{value}</span>
				{sub && <span className="text-xs text-muted-foreground ml-1">({sub})</span>}
			</div>
		</div>
	);
}

export function SystemHealth() {
	const { data, isLoading, error } = useAdminSystemHealth();

	if (isLoading) {
		return (
			<div className="grid lg:grid-cols-2 gap-6">
				{[0, 1].map((i) => (
					<div
						key={`health-skeleton-${i}`}
						className="rounded-xl border border-border bg-card p-6 h-56 animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center py-8 text-muted-foreground">Failed to load system health.</div>
		);
	}

	const totalSessionAuth = data.sessionsByAuth.reduce((sum, s) => sum + s.count, 0);
	const twoFaPct =
		data.twoFaTotal > 0 ? Math.round((data.twoFaEnabled / data.twoFaTotal) * 100) : 0;
	const twoFaAdminPct =
		data.twoFaAdminTotal > 0
			? Math.round((data.twoFaAdminEnabled / data.twoFaAdminTotal) * 100)
			: 0;
	const tokenPct =
		data.totalUsers > 0 ? Math.round((data.usersWithTokens / data.totalUsers) * 100) : 0;

	return (
		<div className="grid lg:grid-cols-2 gap-6">
			{/* Session Overview */}
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-muted-foreground mb-4">Session Overview</h3>
				<StatRow label="Active Sessions" value={data.activeSessions.toLocaleString()} />
				<StatRow label="Avg Sessions / User" value={data.avgSessionsPerUser.toFixed(1)} />
				<div className="mt-3">
					<p className="text-xs text-muted-foreground mb-2">Sessions by Auth Method</p>
					<div className="space-y-2">
						{data.sessionsByAuth.map((s) => (
							<div key={s.method} className="space-y-1">
								<div className="flex justify-between text-xs">
									<span className="capitalize">{s.method}</span>
									<span className="text-muted-foreground">
										{s.count} (
										{totalSessionAuth > 0 ? Math.round((s.count / totalSessionAuth) * 100) : 0}
										%)
									</span>
								</div>
								<ProgressBar value={s.count} max={totalSessionAuth} />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Security & Adoption */}
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-muted-foreground mb-4">Security & Adoption</h3>
				<div className="space-y-4">
					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">2FA Adoption (All Users)</span>
							<span className="font-semibold">{twoFaPct}%</span>
						</div>
						<ProgressBar value={data.twoFaEnabled} max={data.twoFaTotal} />
						<p className="text-xs text-muted-foreground">
							{data.twoFaEnabled} of {data.twoFaTotal} users
						</p>
					</div>
					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">2FA Adoption (Admins)</span>
							<span
								className={cn(
									"font-semibold",
									twoFaAdminPct === 100 ? "text-emerald-500" : "text-amber-500",
								)}
							>
								{twoFaAdminPct}%
							</span>
						</div>
						<ProgressBar
							value={data.twoFaAdminEnabled}
							max={data.twoFaAdminTotal}
							className={twoFaAdminPct === 100 ? "bg-emerald-500" : "bg-amber-500"}
						/>
						<p className="text-xs text-muted-foreground">
							{data.twoFaAdminEnabled} of {data.twoFaAdminTotal} admins
						</p>
					</div>
					<StatRow
						label="Users with API Tokens"
						value={data.usersWithTokens}
						sub={`${tokenPct}%`}
					/>
					<StatRow
						label="Avg Tokens / User"
						value={(data.totalUsers > 0 ? data.totalTokens / data.totalUsers : 0).toFixed(2)}
					/>
				</div>
			</div>
		</div>
	);
}
