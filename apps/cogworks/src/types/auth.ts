export interface DiscordUser {
	id: string;
	username: string;
	globalName: string | null;
	avatar: string | null;
	isOwner: boolean;
}
