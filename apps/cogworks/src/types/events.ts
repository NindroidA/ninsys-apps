export interface EventsConfig {
	enabled: boolean;
	reminderChannelId: string | null;
	defaultReminderMinutes: number;
	postEventSummary: boolean;
	summaryChannelId: string | null;
}

export interface EventTemplate {
	id: string;
	name: string;
	title: string;
	description: string;
	location: string | null;
	entityType: "voice" | "stage" | "external";
	durationMinutes: number;
	recurring: boolean;
	recurringPattern: string | null;
	createdAt: string;
}

export interface UpcomingReminder {
	id: string;
	eventName: string;
	reminderTime: string;
	sent: boolean;
}
