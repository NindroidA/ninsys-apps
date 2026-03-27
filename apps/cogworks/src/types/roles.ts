export type RoleType = "staff" | "admin";

export interface SavedRole {
	id: number;
	guildId: string;
	type: RoleType;
	role: string;
	alias: string;
	createdAt?: string;
}
