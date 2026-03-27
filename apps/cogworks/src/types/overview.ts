export interface GuildOverview {
	systems: {
		tickets: { configured: boolean; activeCount: number };
		applications: { configured: boolean; activeCount: number };
		announcements: { configured: boolean };
		memory: { configured: boolean; itemCount: number };
		rules: { configured: boolean };
		reactionRoles: { configured: boolean; menuCount: number };
		baitChannel: { configured: boolean; enabled: boolean };
		status: { level: string };
	};
	roles: {
		staffCount: number;
		adminCount: number;
	};
}
