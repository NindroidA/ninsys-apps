export type BaitChannelAction = "ban" | "kick" | "mute" | "warn";

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
	banReason: string | null;
	warningMessage: string | null;
	deleteUserMessages: boolean;
	deleteMessageDays: number;
	// v3.0 additions
	testMode?: boolean;
	escalationEnabled?: boolean;
	escalationLogThreshold?: number;
	escalationTimeoutThreshold?: number;
	escalationKickThreshold?: number;
	escalationBanThreshold?: number;
	weeklySummaryEnabled?: boolean;
	weeklySummaryChannelId?: string | null;
	dmNotificationsEnabled?: boolean;
	appealInfo?: string | null;
	additionalChannelIds?: string[];
}

export interface BaitChannelWhitelist {
	roleIds: string[];
	userIds: string[];
}

export interface BaitChannelLog {
	id: string;
	guildId: string;
	userId: string;
	username: string;
	suspicionScore: number;
	action: string;
	flagsDetected: string[];
	createdAt: string;
	// v3.0 override fields
	overridden?: boolean;
	overriddenBy?: string | null;
	overriddenAt?: string | null;
}

export interface BaitChannelStats {
	totalDetections30d: number;
	actionBreakdown: Record<string, number>;
	averageSuspicionScore: number;
	falsePositiveRate: number;
	detectionsByDay: { date: string; count: number }[];
	// v3.0 enhanced stats
	overrideRate?: number;
	scoreDistribution?: { bucket: string; count: number }[];
	topFlags?: { flag: string; count: number }[];
}

export interface BaitKeyword {
	keyword: string;
	weight: number;
	addedBy: string;
	addedAt: string;
}

export interface JoinEvent {
	id: string;
	userId: string;
	username: string;
	timestamp: string;
	isBurst: boolean;
}
