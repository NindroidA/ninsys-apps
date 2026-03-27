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

export interface Ticket {
	id: string;
	guildId: string;
	channelId: string;
	createdBy: string;
	createdByUsername: string;
	type: string;
	status: "open" | "closed";
	assignedTo: string | null;
	assignedAt: string | null;
	lastActivityAt: string | null;
	statusHistory: StatusHistoryEntry[] | null;
	workflowStatus?: WorkflowStatus | null;
	createdAt: string;
	closedAt: string | null;
}
