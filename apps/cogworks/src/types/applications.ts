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

/**
 * The bot's application status: 'created'/'opened' (or a workflow id) while
 * pending, then 'accepted'/'rejected', and 'closed' once archived. The list
 * filter still uses the dashboard's names (pending/approved/denied/archived);
 * the API maps them.
 */
export type ApplicationStatus = string;

/** Approve/Deny apply until the application is decided or archived. */
export function canReviewApplication(status: ApplicationStatus): boolean {
	return !["closed", "accepted", "rejected"].includes(status);
}

/** Maps the bot's values onto the names the status badge knows; workflow ids pass through. */
export function applicationStatusBadge(status: ApplicationStatus): string {
	const names: Record<string, string> = {
		created: "pending",
		opened: "pending",
		accepted: "approved",
		rejected: "denied",
		closed: "archived",
	};
	return names[status] ?? status;
}

/**
 * An applications row. The API sends the id as a string, the position title as
 * `type` and the applicant as `createdBy`; it doesn't send the optional fields yet.
 */
export interface Application {
	id: string;
	guildId: string;
	type?: string | null;
	createdBy?: string;
	positionId?: string;
	positionTitle?: string;
	applicantId?: string;
	applicantUsername?: string;
	status: ApplicationStatus;
	responses?: Record<string, string> | null;
	reviewedBy?: string | null;
	reviewNote?: string | null;
	createdAt?: string;
	reviewedAt?: string | null;
}
