export interface AdminOverview {
	serverCount: number;
	userCount: number;
	commandsRun24h: number;
	uptimeSeconds: number;
	latencyMs: number;
	memoryUsageMb: number;
	botVersion: string;
}

export interface AdminServer {
	id: string;
	name: string;
	icon: string | null;
	memberCount: number;
	joinedAt: string;
	configuredSystems: string[];
}

export interface AdminServerDetail extends AdminServer {
	recentAuditLog?: { action: string; user: string; timestamp: string }[];
	activeTickets?: number;
	activeApplications?: number;
	configStatus?: Record<string, boolean>;
}

export interface AdminAnalytics {
	serverGrowth: { date: string; joined: number; left: number }[];
	commandUsage: { command: string; count: number }[];
	systemUsage: { system: string; configuredCount: number }[];
	errorRate: { date: string; count: number }[];
}

export interface AdminHealth {
	api: { status: string; responseTimeMs: number };
	bot: { status: string; gatewayLatency: number; shardCount: number };
	database: { status: string; poolSize: number; activeConnections: number };
}
