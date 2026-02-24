/**
 * Shared display constants for admin pages and account views
 */

/** Role badge CSS classes (S7: extracted to avoid duplication) */
export const ROLE_COLORS: Record<string, string> = {
	user: "bg-muted text-muted-foreground",
	developer: "bg-blue-500/10 text-blue-500",
	admin: "bg-purple-500/10 text-purple-500",
	super_admin: "bg-amber-500/10 text-amber-500",
};

/** Static Tailwind classes for tier badges (C4: dynamic classes aren't generated at build time) */
export const TIER_BADGE_CLASSES: Record<string, string> = {
	free: "bg-gray-500/10 text-gray-500",
	plus: "bg-blue-500/10 text-blue-500",
	pro: "bg-purple-500/10 text-purple-500",
	max: "bg-amber-500/10 text-amber-500",
};

/** Default page size for paginated admin lists (S9) */
export const ADMIN_PAGE_SIZE = 20;
