export type StatusLevel =
	| "operational"
	| "degraded"
	| "partial_outage"
	| "major_outage"
	| "maintenance";

export interface BotStatus {
	guildId: string;
	level: StatusLevel;
	message: string | null;
	affectedSystems: string[];
	estimatedResolution: string | null;
	isManualOverride: boolean;
	setBy: string | null;
	setAt: string | null;
}
