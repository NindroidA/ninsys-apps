export type IncidentLevel = "operational" | "degraded" | "outage" | "maintenance";

export interface CurrentStatus {
	level: IncidentLevel;
	message: string | null;
	affectedSystems: string[];
	since: string | null;
}

export interface Incident {
	id: string;
	level: IncidentLevel;
	message: string;
	startedAt: string;
	resolvedAt: string | null;
	resolvedBy: string | null;
	duration: number | null;
}
