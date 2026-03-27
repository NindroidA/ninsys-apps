export interface AnnouncementConfig {
	guildId: string;
	enabled: boolean;
	defaultRoleId: string | null;
	defaultChannelId: string | null;
}

export type AnnouncementType =
	| "maintenance_short"
	| "maintenance_long"
	| "update_scheduled"
	| "update_complete"
	| "back_online";

export interface AnnouncementTemplate {
	id: number;
	guildId: string;
	name: string;
	displayName: string;
	description: string | null;
	color: string;
	title: string;
	body: string;
	fields: { name: string; value: string; inline?: boolean }[] | null;
	footerText: string | null;
	showTimestamp: boolean;
	mentionRole: boolean;
	isDefault: boolean;
	createdBy: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AnnouncementPayload {
	templateName?: string;
	type?: AnnouncementType;
	channelId: string;
	params?: Record<string, string>;
	scheduledTime?: string;
	duration?: string;
	version?: string;
	customMessage?: string;
}

export interface AnnouncementLog {
	id: string;
	guildId: string;
	type: AnnouncementType | string;
	channelId: string;
	sentBy: string;
	sentByUsername: string;
	createdAt: string;
}
