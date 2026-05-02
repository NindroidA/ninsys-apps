import { ANALYTICS_PERIODS, type AnalyticsPeriod, isValidAnalyticsPeriod } from "@/types/analytics";
import { cn } from "@ninsys/ui/lib";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface PeriodSelectorProps {
	value: AnalyticsPeriod;
	onChange: (period: AnalyticsPeriod) => void;
	className?: string;
}

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
	7: "7 days",
	30: "30 days",
	90: "90 days",
};

export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center rounded-full bg-muted/50 border border-border p-1",
				className,
			)}
			role="tablist"
			aria-label="Select time period"
		>
			{ANALYTICS_PERIODS.map((period) => {
				const isActive = value === period;
				return (
					<button
						key={period}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(period)}
						className={cn(
							"px-4 py-1.5 rounded-full text-sm font-medium transition-all",
							isActive
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{PERIOD_LABELS[period]}
					</button>
				);
			})}
		</div>
	);
}

/**
 * Hook that reads/writes the analytics period to a URL search param.
 * Defaults to 7 if the param is missing or invalid.
 */
export function useAnalyticsPeriodParam(
	paramName = "period",
): [AnalyticsPeriod, (period: AnalyticsPeriod) => void] {
	const [searchParams, setSearchParams] = useSearchParams();
	const raw = Number(searchParams.get(paramName));
	const value: AnalyticsPeriod = isValidAnalyticsPeriod(raw) ? raw : 7;

	const setValue = useCallback(
		(period: AnalyticsPeriod) => {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set(paramName, String(period));
					return next;
				},
				{ replace: true },
			);
		},
		[setSearchParams, paramName],
	);

	return [value, setValue];
}
