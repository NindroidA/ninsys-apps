/**
 * App-specific utilities for Cogworks dashboard.
 * General utilities (cn, formatDate, etc.) come from @ninsys/ui/lib.
 */

/** Extract a plain Discord ID from a mention string like <@&123> or <@123>, or return as-is if already plain */
export function extractDiscordId(mention: string): string {
	const match = mention.match(/^<[@#&!]*(\d+)>$/);
	return match?.[1] ?? mention;
}

/** Get initials from a string (for avatar fallbacks) */
export function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.map((word) => word.charAt(0))
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/** Normalize a color value that may be a number or hex string to a number */
export function normalizeColor(color: number | string): number {
	if (typeof color === "string") return Number.parseInt(color.replace("#", ""), 16) || 0;
	return color;
}

/** Convert Discord integer color to hex string */
export function intToHex(color: number): string {
	if (color === 0) return "#99AAB5"; // Discord default gray
	return `#${color.toString(16).padStart(6, "0")}`;
}

/** Format seconds into a human-readable uptime string (e.g. "2d 5h 30m") */
export function formatUptime(seconds: number): string {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	const parts = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);

	return parts.join(" ") || "< 1m";
}

/** Deep equality check for form dirty detection */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a !== typeof b) return false;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((item, i) => deepEqual(item, b[i]));
	}

	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a as Record<string, unknown>);
		const keysB = Object.keys(b as Record<string, unknown>);
		if (keysA.length !== keysB.length) return false;
		return keysA.every((key) =>
			deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
		);
	}

	return false;
}
