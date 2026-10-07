export interface WorkflowStatus {
	id: string;
	label: string;
	emoji: string;
	color: string;
}

export interface TicketConfig {
	guildId: string;
	enabled: boolean;
	channelId: string | null;
	categoryId: string | null;
	archiveForumId: string | null;
	adminOnlyMentionStaff: boolean;
	pingStaffOn18Verify: boolean;
	pingStaffOnBanAppeal: boolean;
	// v3.0 workflow
	enableWorkflow?: boolean;
	workflowStatuses?: WorkflowStatus[];
	autoCloseEnabled?: boolean;
	autoCloseDays?: number;
	autoCloseWarningHours?: number;
	autoCloseStatus?: string;
}

export interface CustomField {
	/** Client-side stable key for React rendering. Not persisted to API. */
	_key?: string;
	label: string;
	placeholder: string;
	style: "short" | "paragraph";
	required: boolean;
	minLength: number | null;
	maxLength: number | null;
}

export interface CustomTicketType {
	id: number;
	guildId: string;
	typeId: string;
	displayName: string;
	emoji: string | null;
	embedColor: string | null;
	description: string | null;
	isDefault: boolean;
	isActive: boolean;
	sortOrder: number;
	customFields: CustomField[];
	pingStaffOnCreate: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UserTicketRestriction {
	id: string;
	guildId: string;
	userId: string;
	username: string;
	/** The bot stores restrictions per type; older rows may still be null. */
	typeId: string | null;
	reason: string;
	createdAt: string;
}

export interface StatusHistoryEntry {
	statusId: string;
	label: string;
	emoji: string;
	changedBy: string;
	timestamp: string;
}

/**
 * The bot's ticket status: 'created', 'opened', 'adminOnly', 'error', a workflow
 * status id ('in-progress', ...), or 'closed'. Anything but 'closed' is active.
 */
export type TicketStatus = string;

export function isTicketClosed(status: TicketStatus): boolean {
	return status === "closed";
}

/** Maps the bot's values onto the names the status badge knows; workflow ids pass through. */
export function ticketStatusBadge(status: TicketStatus): string {
	if (status === "created" || status === "opened") return "open";
	if (status === "adminOnly") return "admin_only";
	return status;
}

/** A tickets row. The API sends the id as a string; it doesn't send the optional fields yet. */
export interface Ticket {
	id: string;
	guildId: string;
	channelId: string | null;
	createdBy: string;
	createdByUsername?: string;
	type: string | null;
	status: TicketStatus;
	assignedTo?: string | null;
	assignedAt?: string | null;
	lastActivityAt?: string | null;
	statusHistory?: StatusHistoryEntry[] | null;
	workflowStatus?: WorkflowStatus | null;
	createdAt?: string;
	closedAt?: string | null;
}
