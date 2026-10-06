/** Discord channel type → display icon character */
export const CHANNEL_TYPE_ICONS: Record<number, string> = {
	0: "#", // Text
	2: "🔊", // Voice
	4: "📁", // Category
	5: "#", // Announcement
	13: "🎤", // Stage
	15: "📋", // Forum
};

/** Bot invite URL builder */
export function getBotInviteUrl(guildId: string): string {
	return `https://discord.com/oauth2/authorize?client_id=${
		import.meta.env.VITE_BOT_CLIENT_ID ?? ""
	}&scope=bot+applications.commands&permissions=8&guild_id=${guildId}`;
}

/**
 * Discord CDN helpers
 */
export function getGuildIconUrl(
	guildId: string,
	iconHash: string | null,
	size = 128,
): string | null {
	if (!iconHash) return null;
	return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.webp?size=${size}`;
}

export function getUserAvatarUrl(
	userId: string,
	avatarHash: string | null,
	size = 128,
): string | null {
	if (!avatarHash) return null;
	return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.webp?size=${size}`;
}

export function getDefaultAvatarUrl(userId: string): string {
	try {
		const index = Number(BigInt(userId) % 5n);
		return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
	} catch {
		return "https://cdn.discordapp.com/embed/avatars/0.png";
	}
}

/**
 * Dashboard modules whose bot backend does not exist yet, keyed by route
 * segment (or tab id) with the label shown on the "not available yet" page.
 * Their sidebar entries and tabs are hidden, and direct links show a friendly
 * placeholder instead of a page full of failing requests.
 * Delete a line to re-enable that module once its backend lands.
 */
export const UNAVAILABLE_MODULES: Readonly<Record<string, string>> = {
	xp: "XP & Levels",
	starboard: "Starboard",
	events: "Events",
	onboarding: "Onboarding",
	sla: "Ticket SLA",
	routing: "Smart Routing",
	incidents: "Incidents",
	"analytics-settings": "Analytics settings",
};

export function isModuleAvailable(module: string): boolean {
	return !Object.prototype.hasOwnProperty.call(UNAVAILABLE_MODULES, module);
}
