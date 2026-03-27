import type { CustomField } from "./tickets";

export interface ApplicationConfig {
	guildId: string;
	enabled: boolean;
	channelId: string | null;
	categoryId: string | null;
	archiveForumId: string | null;
}

export interface Position {
	id: string;
	guildId: string;
	title: string;
	description: string | null;
	emoji: string | null;
	ageGateEnabled: boolean;
	isActive: boolean;
	displayOrder: number;
	customFields: CustomField[];
}

export type PositionTemplate =
	| "general"
	| "staff"
	| "content-creator"
	| "developer"
	| "partnership";

export interface Application {
	id: string;
	guildId: string;
	positionId: string;
	positionTitle: string;
	applicantId: string;
	applicantUsername: string;
	status: "pending" | "approved" | "denied" | "archived";
	responses: Record<string, string>;
	reviewedBy: string | null;
	reviewNote: string | null;
	createdAt: string;
	reviewedAt: string | null;
}
