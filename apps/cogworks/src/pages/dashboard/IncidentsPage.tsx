/** Bot-wide status page — not guild-scoped. Routed at /dashboard/incidents outside :guildId. */
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { useCurrentStatus, useIncidentHistory } from "@/hooks/useIncidents";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { IncidentLevel } from "@/types/incidents";
import { Badge, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { AlertTriangle, CheckCircle, Clock, Construction, XCircle } from "lucide-react";

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

const LEVEL_CONFIG: Record<
	IncidentLevel,
	{
		label: string;
		variant: "default" | "secondary" | "error";
		icon: typeof CheckCircle;
		color: string;
		bgColor: string;
	}
> = {
	operational: {
		label: "Operational",
		variant: "default",
		icon: CheckCircle,
		color: "text-green-500",
		bgColor: "bg-green-500/10",
	},
	degraded: {
		label: "Degraded",
		variant: "secondary",
		icon: AlertTriangle,
		color: "text-yellow-500",
		bgColor: "bg-yellow-500/10",
	},
	outage: {
		label: "Outage",
		variant: "error",
		icon: XCircle,
		color: "text-destructive",
		bgColor: "bg-destructive/10",
	},
	maintenance: {
		label: "Maintenance",
		variant: "secondary",
		icon: Construction,
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
	},
};

function formatDuration(minutes: number | null): string {
	if (minutes == null) return "Ongoing";
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	const remaining = minutes % 60;
	return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function IncidentsPage() {
	usePageTitle("Status Incidents");

	const { data: current, isLoading: currentLoading } = useCurrentStatus();
	const { data: history = [], isLoading: historyLoading } = useIncidentHistory();

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader title="Status Incidents" description="Current bot status and incident history" />

			<div className="space-y-6">
				{/* Current Status */}
				{currentLoading ? (
					<TabFallback />
				) : current ? (
					<Card className="p-6">
						<div className="flex items-start gap-4">
							{(() => {
								const cfg = LEVEL_CONFIG[current.level];
								const Icon = cfg.icon;
								return (
									<div className={`rounded-lg ${cfg.bgColor} p-3 ${cfg.color}`}>
										<Icon className="h-6 w-6" />
									</div>
								);
							})()}
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h2 className="text-lg font-semibold">Current Status</h2>
									<Badge variant={LEVEL_CONFIG[current.level].variant}>
										{LEVEL_CONFIG[current.level].label}
									</Badge>
								</div>
								{current.message && (
									<p className="text-sm text-muted-foreground">{current.message}</p>
								)}
								{current.affectedSystems.length > 0 && (
									<div className="flex flex-wrap gap-1.5 mt-3">
										{current.affectedSystems.map((system) => (
											<Badge key={system} variant="secondary">
												{system}
											</Badge>
										))}
									</div>
								)}
								{current.since && (
									<p className="text-xs text-muted-foreground mt-2">
										Since {new Date(current.since).toLocaleString()}
									</p>
								)}
							</div>
						</div>
					</Card>
				) : (
					<Card className="p-6 text-center">
						<CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
						<p className="font-medium">All Systems Operational</p>
						<p className="text-sm text-muted-foreground mt-1">No active incidents reported.</p>
					</Card>
				)}

				{/* Incident History */}
				<ConfigSection title="Incident History" description="Past incidents and maintenance events">
					{historyLoading ? (
						<TabFallback />
					) : history.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							No incident history available.
						</p>
					) : (
						<div className="relative">
							{/* Timeline line */}
							<div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

							<div className="space-y-4">
								{history.map((incident) => {
									const cfg = LEVEL_CONFIG[incident.level];
									return (
										<div key={incident.id} className="relative pl-10">
											{/* Timeline dot */}
											<div
												className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-background ${
													incident.resolvedAt ? "bg-muted-foreground" : "bg-destructive"
												}`}
											/>

											<div className="rounded-lg border border-border p-3">
												<div className="flex items-center gap-2 mb-1">
													<Badge variant={cfg.variant}>{cfg.label}</Badge>
													<span className="text-xs text-muted-foreground flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{formatDuration(incident.duration)}
													</span>
												</div>
												<p className="text-sm">{incident.message}</p>
												<div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
													<span>Started: {new Date(incident.startedAt).toLocaleString()}</span>
													{incident.resolvedAt && (
														<span>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</span>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</ConfigSection>
			</div>
		</FadeIn>
	);
}
