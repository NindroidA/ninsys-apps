export interface RulesConfig {
	guildId: string;
	enabled: boolean;
	channelId: string | null;
	messageId: string | null;
	roleId: string | null;
	emoji: string | null;
	customText: string | null;
}
