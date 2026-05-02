/**
 * Cogworks Analytics Types
 *
 * Canonical field contracts from cogworks-bot v3.1.2.
 * All numeric fields are non-null (0 when no data). Dates are YYYY-MM-DD UTC strings.
 */

// --- Config (digest settings) ---

export interface AnalyticsConfig {
	enabled: boolean;
	digestChannelId: string | null;
	frequency: "weekly" | "monthly" | "both";
	digestDay: number;
}

// --- Shared metric shapes ---

/**
 * Server-computed delta string.
 * Format: "+12%" / "-3%" / "0%" / "—" (em-dash for divide-by-zero).
 */
export type AnalyticsDelta = string;

export interface ComparedToPrevious {
	messages: AnalyticsDelta;
	activeMembers: AnalyticsDelta;
	joins: AnalyticsDelta;
	leaves: AnalyticsDelta;
	voiceMinutes: AnalyticsDelta;
}

// --- Overview endpoint ---
// GET /v2/cogworks/guilds/:guildId/analytics/overview?days=N

export interface AnalyticsOverviewChannel {
	channelId: string;
	channelName: string;
	messages: number;
}

export interface AnalyticsOverview {
	period: string; // e.g. "7d", "30d"
	messages: number;
	activeMembers: number;
	joins: number;
	leaves: number;
	voiceMinutes: number;
	topChannels: AnalyticsOverviewChannel[]; // max 5
	comparedToPrevious: ComparedToPrevious;
}

// --- Growth endpoint ---
// GET /v2/cogworks/guilds/:guildId/analytics/growth?days=N

export interface GrowthPoint {
	date: string; // YYYY-MM-DD UTC
	joins: number;
	leaves: number;
	totalMembers: number; // end-of-day snapshot
}

export interface AnalyticsGrowth {
	days: number;
	data: GrowthPoint[]; // oldest-first; missing days omitted
}

// --- Channels endpoint ---
// GET /v2/cogworks/guilds/:guildId/analytics/channels?days=N

export interface ChannelActivity {
	channelId: string;
	channelName: string;
	messages: number;
	uniqueUsers: number; // currently always 0 — deferred feature
}

export interface AnalyticsChannels {
	days: number;
	channels: ChannelActivity[]; // sorted by messages DESC
}

// --- Hours endpoint ---
// GET /v2/cogworks/guilds/:guildId/analytics/hours?days=N

export interface HourlyBucket {
	hour: number; // 0-23 UTC
	messages: number;
}

export interface AnalyticsHours {
	days: number;
	hourly: HourlyBucket[]; // always 24 entries, 0..23
}

// --- Snapshots endpoint ---
// GET /v2/cogworks/guilds/:guildId/analytics/snapshots?from=X&to=Y

export interface AnalyticsSnapshot {
	date: string; // YYYY-MM-DD UTC
	messages: number;
	joins: number;
	leaves: number;
	voiceMinutes: number;
	activeMembers: number;
}

export interface AnalyticsSnapshots {
	from: string;
	to: string;
	snapshots: AnalyticsSnapshot[]; // ASC by date; missing days omitted
}

// --- Dashboard (legacy aggregate bundle) ---
// GET /v2/cogworks/guilds/:guildId/analytics/dashboard?days=N

export interface AnalyticsDashboard {
	overview: Pick<
		AnalyticsOverview,
		"messages" | "activeMembers" | "joins" | "leaves" | "voiceMinutes"
	>;
	growth: GrowthPoint[];
	topChannels: ChannelActivity[];
	heatmap: HourlyBucket[];
	peakHour: number;
}

// --- Period type (shared with PeriodSelector component) ---

export type AnalyticsPeriod = 7 | 30 | 90;

export const ANALYTICS_PERIODS: AnalyticsPeriod[] = [7, 30, 90];

export function isValidAnalyticsPeriod(value: unknown): value is AnalyticsPeriod {
	return value === 7 || value === 30 || value === 90;
}
