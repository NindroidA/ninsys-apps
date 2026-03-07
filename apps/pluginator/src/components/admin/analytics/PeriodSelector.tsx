/**
 * Tab-style period toggle for analytics
 * Stores selected period in URL search params for shareability
 */

import type { AnalyticsPeriod } from "@/hooks/useAdminAnalytics";
import { cn } from "@ninsys/ui/lib";
import { useSearchParams } from "react-router-dom";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
	{ value: "1d", label: "Today" },
	{ value: "7d", label: "7 Days" },
	{ value: "30d", label: "30 Days" },
	{ value: "all", label: "All Time" },
];

const VALID_PERIODS = new Set<string>(PERIODS.map((p) => p.value));

export function usePeriod(): [AnalyticsPeriod, (p: AnalyticsPeriod) => void] {
	const [searchParams, setSearchParams] = useSearchParams();
	const raw = searchParams.get("period") ?? "30d";
	const period: AnalyticsPeriod = VALID_PERIODS.has(raw)
		? (raw as AnalyticsPeriod)
		: "30d";

	const setPeriod = (p: AnalyticsPeriod) => {
		setSearchParams({ period: p }, { replace: true });
	};

	return [period, setPeriod];
}

interface PeriodSelectorProps {
	period: AnalyticsPeriod;
	onChange: (period: AnalyticsPeriod) => void;
}

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
	return (
		<div className="inline-flex rounded-lg border border-border bg-card p-1 gap-1">
			{PERIODS.map((p) => (
				<button
					key={p.value}
					type="button"
					onClick={() => onChange(p.value)}
					className={cn(
						"px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
						period === p.value
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:text-foreground hover:bg-muted",
					)}
				>
					{p.label}
				</button>
			))}
		</div>
	);
}
