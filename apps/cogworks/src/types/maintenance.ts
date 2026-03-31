export type StatusLevel =
	| "operational"
	| "degraded"
	| "partial-outage"
	| "major-outage"
	| "maintenance";

export interface MaintenanceStatus {
	active: boolean;
	startedAt?: string;
	version?: string;
}

export interface BotStatusFull {
	level: StatusLevel;
	message: string | null;
	presenceText: string;
	isOverride: boolean;
	overrideExpiresAt: string | null;
	uptime: number;
	guilds: number;
	version: string;
}
