export interface XpConfig {
	enabled: boolean;
	minXpPerMessage: number;
	maxXpPerMessage: number;
	cooldownSeconds: number;
	voiceXpEnabled: boolean;
	xpPerVoiceMinute: number;
	levelUpChannelId: string | null;
	levelUpSameChannel: boolean;
	levelUpMessage: string | null;
	stackMultipliers: boolean;
	ignoredChannelIds: string[];
}

export interface ChannelMultiplier {
	channelId: string;
	channelName: string;
	multiplier: number;
}

export interface RoleReward {
	id: string;
	level: number;
	roleId: string;
	roleName: string;
	removeOnDelevel: boolean;
}

export interface LeaderboardEntry {
	rank: number;
	userId: string;
	username: string;
	level: number;
	xp: number;
	messages: number;
	voiceMinutes: number;
}

export interface XpImportResult {
	id: string;
	source: "mee6" | "csv";
	status: "running" | "completed" | "failed" | "cancelled";
	imported: number;
	skipped: number;
	failed: number;
	createdAt: string;
}
