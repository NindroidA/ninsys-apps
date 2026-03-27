export interface StarboardConfig {
	enabled: boolean;
	channelId: string | null;
	emoji: string;
	threshold: number;
	allowSelfStar: boolean;
	ignoreBots: boolean;
	ignoreNsfw: boolean;
	ignoredChannelIds: string[];
}

export interface StarredMessage {
	id: string;
	authorId: string;
	authorUsername: string;
	content: string;
	starCount: number;
	messageUrl: string;
	createdAt: string;
}

export interface StarboardStats {
	totalStarred: number;
	mostStarred: StarredMessage | null;
	topUsers: { userId: string; username: string; count: number }[];
}
