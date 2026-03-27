export interface AnalyticsConfig {
	enabled: boolean;
	digestChannelId: string | null;
	frequency: "weekly" | "monthly" | "both";
	digestDay: number;
}

export interface AnalyticsOverview {
	messages: number;
	activeMembers: number;
	joins: number;
	leaves: number;
	voiceMinutes: number;
}

export interface AnalyticsGrowth {
	date: string;
	memberCount: number;
}

export interface ChannelActivity {
	channelId: string;
	channelName: string;
	messageCount: number;
}

export interface ActivityHeatmap {
	hour: number;
	day: number;
	count: number;
}

export interface AnalyticsDashboard {
	overview: AnalyticsOverview;
	growth: AnalyticsGrowth[];
	topChannels: ChannelActivity[];
	heatmap: ActivityHeatmap[];
	peakHour: number;
}
