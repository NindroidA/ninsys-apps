/**
 * Admin Analytics - comprehensive stats dashboard
 */

import { DistributionCharts } from "@/components/admin/analytics/DistributionCharts";
import { KpiCards } from "@/components/admin/analytics/KpiCards";
import { Leaderboards } from "@/components/admin/analytics/Leaderboards";
import {
	PeriodSelector,
	usePeriod,
} from "@/components/admin/analytics/PeriodSelector";
import { SystemHealth } from "@/components/admin/analytics/SystemHealth";
import { TrendCharts } from "@/components/admin/analytics/TrendCharts";
import { FadeIn } from "@ninsys/ui/components/animations";

export function AdminAnalyticsPage() {
	const [period, setPeriod] = usePeriod();

	return (
		<div className="space-y-8">
			<FadeIn>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<h1 className="text-2xl font-bold">Analytics</h1>
					<PeriodSelector period={period} onChange={setPeriod} />
				</div>
			</FadeIn>

			<FadeIn delay={0.05}>
				<KpiCards period={period} />
			</FadeIn>

			<FadeIn delay={0.1}>
				<TrendCharts period={period} />
			</FadeIn>

			<FadeIn delay={0.15}>
				<DistributionCharts />
			</FadeIn>

			<FadeIn delay={0.2}>
				<Leaderboards period={period} />
			</FadeIn>

			<FadeIn delay={0.25}>
				<SystemHealth />
			</FadeIn>
		</div>
	);
}
