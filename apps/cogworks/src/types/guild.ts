export interface Guild {
	id: string;
	name: string;
	icon: string | null;
	hasBot: boolean;
	isAdmin: boolean;
	permissions?: string;
}

export interface DiscordChannel {
	id: string;
	name: string;
	type: number;
	parentId: string | null;
	position: number;
}

export interface DiscordRole {
	id: string;
	name: string;
	color: number | string;
	position: number;
}
