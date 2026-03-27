export interface AuditLogEntry {
	id: string;
	action: string;
	triggeredBy: string;
	source: "dashboard" | "command";
	details: Record<string, unknown>;
	createdAt: string;
}
