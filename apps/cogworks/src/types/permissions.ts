/**
 * Cogworks Permission Types (v3.1.3)
 *
 * Feature-based access control. Admins grant roles one of three levels
 * (`use` / `manage` / `admin`) on individual bot features. Levels are
 * cumulative (`admin` ⊇ `manage` ⊇ `use`).
 *
 * Defaults: until a feature has any grant, access is Discord-admin-only.
 * Adding any grant opts the guild into the new system for that feature.
 */

export type PermissionLevel = "use" | "manage" | "admin";

export interface Permission {
	id: number;
	feature: string;
	roleId: string;
	/** `null` when the role was deleted from the guild. */
	roleName: string | null;
	level: PermissionLevel;
}

export interface PermissionsResponse {
	permissions: Permission[];
	features: string[];
	levels: PermissionLevel[];
}

export interface UpsertPermissionInput {
	feature: string;
	roleId: string;
	level: PermissionLevel;
	/** Optional acting user ID. Lands in audit log. */
	triggeredBy?: string;
}

export interface UpsertPermissionResponse {
	permission: Permission;
}

// Display metadata for rendering

export const PERMISSION_LEVEL_ORDER: Record<PermissionLevel, number> = {
	use: 1,
	manage: 2,
	admin: 3,
};

export const PERMISSION_LEVEL_LABELS: Record<PermissionLevel, string> = {
	use: "Use",
	manage: "Manage",
	admin: "Admin",
};

export const PERMISSION_LEVEL_DESCRIPTIONS: Record<PermissionLevel, string> = {
	use: "Can run the feature",
	manage: "Can configure the feature",
	admin: "Full control of the feature",
};

/**
 * Human-readable labels for feature keys. Falls back to a title-cased
 * version of the key when a feature isn't mapped — so new bot features
 * appear automatically with a sensible default label.
 */
const FEATURE_LABELS: Record<string, string> = {
	tickets: "Tickets",
	announcements: "Announcements",
	baitchannel: "Bait Channel",
	memory: "Memory",
	xp: "XP & Levels",
	starboard: "Starboard",
	events: "Events",
	reactionroles: "Reaction Roles",
	onboarding: "Onboarding",
	automod: "AutoMod",
	rules: "Rules",
	analytics: "Analytics",
};

export function getFeatureLabel(feature: string): string {
	if (FEATURE_LABELS[feature]) return FEATURE_LABELS[feature];
	// Fallback: title-case the key (e.g. "myfeature" → "Myfeature")
	return feature.charAt(0).toUpperCase() + feature.slice(1);
}

/**
 * Compare two levels. Returns negative / zero / positive like Array.sort.
 */
export function compareLevels(a: PermissionLevel, b: PermissionLevel): number {
	return PERMISSION_LEVEL_ORDER[a] - PERMISSION_LEVEL_ORDER[b];
}
