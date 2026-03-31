import { PageHeader } from "@/components/dashboard/PageHeader";
import type { ErrorLogEntry } from "@/hooks/useAdminEnhanced";
import { useErrorLogs } from "@/hooks/useAdminEnhanced";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { AlertTriangle, Loader2, ShieldAlert, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

type SeverityFilter = "all" | "critical" | "error" | "warn";

const SEVERITY_CONFIG: Record<
	ErrorLogEntry["severity"],
	{ label: string; color: string; bg: string; icon: typeof AlertTriangle }
> = {
	critical: {
		label: "Critical",
		color: "text-red-400 border-red-500/30",
		bg: "bg-red-500/10",
		icon: ShieldAlert,
	},
	error: {
		label: "Error",
		color: "text-orange-400 border-orange-500/30",
		bg: "bg-orange-500/10",
		icon: TriangleAlert,
	},
	warn: {
		label: "Warning",
		color: "text-yellow-400 border-yellow-500/30",
		bg: "bg-yellow-500/10",
		icon: AlertTriangle,
	},
};

const FILTER_OPTIONS: { value: SeverityFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "critical", label: "Critical" },
	{ value: "error", label: "Error" },
	{ value: "warn", label: "Warning" },
];

function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);
	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function AdminErrorsPage() {
	usePageTitle("Error Logs \u2014 Admin");
	const { data: errors, isLoading } = useErrorLogs(50);
	const [filter, setFilter] = useState<SeverityFilter>("all");

	const filtered = useMemo(() => {
		if (!errors) return [];
		if (filter === "all") return errors;
		return errors.filter((e) => e.severity === filter);
	}, [errors, filter]);

	return (
		<FadeIn>
			<PageHeader title="Error Logs" description="Recent errors from the API and bot" />

			<div className="space-y-4 max-w-5xl">
				{/* Filter bar */}
				<div className="flex items-center gap-1 rounded-lg border border-border p-0.5 w-fit">
					{FILTER_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => setFilter(opt.value)}
							className={cn(
								"px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
								filter === opt.value
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{opt.label}
						</button>
					))}
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					</div>
				) : filtered.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<AlertTriangle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
						<p className="text-muted-foreground">No errors recorded</p>
					</div>
				) : (
					<Card className="divide-y divide-border overflow-hidden">
						{/* Table header */}
						<div className="grid grid-cols-[90px_1fr_80px_140px_160px] gap-3 px-4 py-2.5 bg-muted/30 text-xs font-medium text-muted-foreground">
							<span>Severity</span>
							<span>Message</span>
							<span>Source</span>
							<span>Endpoint</span>
							<span>Timestamp</span>
						</div>

						{/* Rows */}
						{filtered.map((error, i) => {
							const config = SEVERITY_CONFIG[error.severity];
							const SevIcon = config.icon;
							return (
								<div
									key={`${error.timestamp}-${i}`}
									className="grid grid-cols-[90px_1fr_80px_140px_160px] gap-3 px-4 py-3 items-center hover:bg-muted/20 transition-colors"
								>
									<Badge
										variant="outline"
										className={cn("text-xs gap-1 w-fit", config.color, config.bg)}
									>
										<SevIcon className="h-3 w-3" />
										{config.label}
									</Badge>
									<p className="text-sm truncate" title={error.message}>
										{error.message}
									</p>
									<span className="text-xs text-muted-foreground uppercase tracking-wide">
										{error.source}
									</span>
									<span
										className="text-xs text-muted-foreground font-mono truncate"
										title={error.endpoint ?? undefined}
									>
										{error.endpoint ?? "\u2014"}
									</span>
									<span className="text-xs text-muted-foreground">
										{formatTimestamp(error.timestamp)}
									</span>
								</div>
							);
						})}
					</Card>
				)}
			</div>
		</FadeIn>
	);
}
