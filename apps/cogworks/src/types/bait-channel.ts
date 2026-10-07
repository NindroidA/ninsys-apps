export type BaitChannelAction = "ban" | "kick" | "timeout" | "log-only";

/**
 * GET /bait-channel/config. The API merges its own row with the settings only
 * the bot's table holds, under the bot's names (it also accepts and returns the
 * older webapp names, but these are the contract).
 */
export interface BaitChannelConfig {
	guildId: string;
	enabled: boolean;
	channelId: string | null;
	logChannelId: string | null;
	actionType: BaitChannelAction;
	gracePeriodSeconds: number;
	enableSmartDetection: boolean;
	instantActionThreshold: number;
	minAccountAgeDays: number;
	minMembershipMinutes: number;
	minMessageCount: number;
	requireVerification: boolean;
	banReason: string;
	warningMessage: string;
	deleteUserMessages: boolean;
	/** The bot stores hours; the API adds this rounded day count and converts it back on save. */
	deleteMessageDays: number;
	testMode?: boolean;
	enableEscalation?: boolean;
	escalationLogThreshold?: number;
	escalationTimeoutThreshold?: number;
	escalationKickThreshold?: number;
	escalationBanThreshold?: number;
	enableWeeklySummary?: boolean;
	summaryChannelId?: string | null;
	dmBeforeAction?: boolean;
	appealInfo?: string | null;
}

export interface BaitChannelWhitelist {
	whitelistedRoles: string[];
	whitelistedUsers: string[];
}

/** A bait_channel_logs row. */
export interface BaitChannelLog {
	id: number;
	guildId: string;
	userId: string;
	username: string;
	suspicionScore: number;
	/** 'ban', 'kick', 'timeout', 'logged', 'test-<action>', 'failed', 'superseded-by-mod', ... */
	actionTaken: string;
	/** Flag name -> whether it fired. */
	detectionFlags: Record<string, boolean | undefined> | null;
	createdAt: string;
	// The bot's override columns. Absent until the API's log entity maps them.
	overridden?: boolean;
	overriddenBy?: string | null;
	overriddenAt?: string | null;
}

/** The bot's GET /bait-channel/stats body, as the API proxies it. */
export interface BaitChannelStatsResponse {
	days?: number;
	total?: number;
	actionBreakdown?: Record<string, number>;
	/** Already a percentage (0-100). */
	overrideRate?: number;
	overriddenCount?: number;
	/** Bucket label ('0-9' ... '90-100') -> count. */
	scoreDistribution?: Record<string, number>;
	topFlags?: { flag: string; count: number }[];
}

export interface BaitChannelStats {
	total: number;
	actionBreakdown: Record<string, number>;
	/** Percentage (0-100). */
	overrideRate: number;
	overriddenCount: number;
	scoreDistribution: { bucket: string; count: number }[];
	topFlags: { flag: string; count: number }[];
}

export interface BaitKeyword {
	id: number;
	keyword: string;
	weight: number;
	/** Discord user id, 'system' or 'dashboard'. */
	createdBy: string;
	createdAt: string;
}

/** A join_events row. */
export interface JoinEvent {
	id: number;
	userId: string;
	joinedAt: string;
	accountCreatedAt: string;
	isSuspicious: boolean;
}
