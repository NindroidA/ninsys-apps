export type ReactionRoleMode = "normal" | "unique" | "lock";

export interface ReactionRoleMenu {
	id: string;
	guildId: string;
	name: string;
	description: string | null;
	channelId: string | null;
	messageId: string | null;
	mode: ReactionRoleMode;
	isValid: boolean;
	options: ReactionRoleOption[];
	createdAt: string;
}

export interface ReactionRoleOption {
	id: string;
	menuId: string;
	emoji: string;
	roleId: string;
	description: string | null;
	sortOrder: number;
}
