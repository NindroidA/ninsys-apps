/**
 * 6 KPI stat cards with comparison badges
 */

import type { AnalyticsPeriod } from "@/hooks/useAdminAnalytics";
import { useAdminKPIs } from "@/hooks/useAdminAnalytics";
import {
	CreditCard,
	DollarSign,
	Download,
	ShieldCheck,
	UserPlus,
	Users,
} from "lucide-react";
import { ComparisonBadge } from "./ComparisonBadge";

interface KpiCardsProps {
	period: AnalyticsPeriod;
}

export function KpiCards({ period }: KpiCardsProps) {
	const { data, isLoading, error } = useAdminKPIs(period);

	if (isLoading) {
		return (
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={`kpi-skeleton-${i}`}
						className="rounded-xl border border-border bg-card p-6 animate-pulse h-28"
					/>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Failed to load KPIs.
			</div>
		);
	}

	const showComparison = period !== "all";

	const cards = [
		{
			label: "Total Users",
			value: data.totalUsers.toLocaleString(),
			icon: Users,
			comparison: null,
		},
		{
			label: "New Signups",
			value: data.newSignups.toLocaleString(),
			icon: UserPlus,
			comparison: showComparison
				? { current: data.newSignups, previous: data.newSignupsPrevious }
				: null,
		},
		{
			label: "Downloads",
			value: data.totalDownloads.toLocaleString(),
			icon: Download,
			comparison: showComparison
				? {
						current: data.totalDownloads,
						previous: data.totalDownloadsPrevious,
					}
				: null,
		},
		{
			label: "Active Subscriptions",
			value: data.activeSubscriptions.toLocaleString(),
			icon: CreditCard,
			comparison: null,
		},
		{
			label: "Revenue",
			value: `$${(data.revenuePeriod / 100).toFixed(2)}`,
			icon: DollarSign,
			comparison: showComparison
				? {
						current: data.revenuePeriod,
						previous: data.revenuePeriodPrevious,
					}
				: null,
			sublabel: `MRR: $${(data.mrr / 100).toFixed(2)}`,
		},
		{
			label: "2FA Adoption",
			value: `${Math.round(data.twoFaAdoptionRate * 100)}%`,
			icon: ShieldCheck,
			comparison: null,
		},
	];

	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{cards.map((card) => (
				<div
					key={card.label}
					className="rounded-xl border border-border bg-card p-6"
				>
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground">{card.label}</p>
							<p className="text-3xl font-bold mt-1">{card.value}</p>
							{"sublabel" in card && card.sublabel && (
								<p className="text-xs text-muted-foreground mt-1">
									{card.sublabel}
								</p>
							)}
							{card.comparison && (
								<div className="mt-2">
									<ComparisonBadge
										current={card.comparison.current}
										previous={card.comparison.previous}
									/>
								</div>
							)}
						</div>
						<div className="rounded-lg p-2 bg-primary/10">
							<card.icon className="h-5 w-5 text-primary" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
