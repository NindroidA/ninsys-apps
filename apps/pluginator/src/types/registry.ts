/**
 * Plugin Registry Types
 *
 * Types for the curated plugin registry marketplace.
 * Aligned with CLI types from pluginator/src/core/registry/registry-types.ts
 */

/**
 * Plugin category for organization
 */
export type PluginCategory =
	| "admin"
	| "economy"
	| "permissions"
	| "world"
	| "gameplay"
	| "chat"
	| "protection"
	| "utility"
	| "library"
	| "performance"
	| "cosmetic"
	| "minigames"
	| "social";

/**
 * Plugin source types
 */
export type PluginSourceType =
	| "modrinth"
	| "hangar"
	| "spigot"
	| "curseforge"
	| "github"
	| "jenkins"
	| "web-manifest";

/**
 * Source configuration for a registry plugin
 */
export interface RegistryPluginSource {
	type: PluginSourceType;
	projectSlug?: string;
	hangarSlug?: string;
	resourceId?: number;
	curseforgeId?: string;
	repoSlug?: string;
	jenkinsJob?: string;
	jenkinsUrl?: string;
	preferred?: boolean;
	releaseChannel?: "release" | "beta" | "alpha";
}

/**
 * Minecraft version compatibility range
 */
export interface MinecraftVersionRange {
	min: string;
	max: string;
}

/**
 * A plugin entry in the curated registry
 */
export interface RegistryPlugin {
	id: string;
	name: string;
	description: string;
	authors: string[];
	website?: string;
	category: PluginCategory;
	tags: string[];
	sources: RegistryPluginSource[];
	minecraftVersions: MinecraftVersionRange;
	premium?: boolean;
	verified?: boolean;
	popular?: boolean;
	dependencies?: string[];
	conflicts?: string[];
	notes?: string;
	downloads?: number;
	rating?: number;
	lastUpdated?: string;
	createdAt?: string;
	version?: string;
}

/**
 * The full plugin registry structure
 */
export interface PluginRegistry {
	version: string;
	lastUpdated: string;
	description?: string;
	plugins: RegistryPlugin[];
}

// =============================================================================
// Web-specific types
// =============================================================================

/**
 * Filter options for plugin list
 */
export interface RegistryFilters {
	search?: string;
	category?: PluginCategory;
	mcVersion?: string;
	sort?: "name" | "downloads" | "rating" | "updated";
	sortOrder?: "asc" | "desc";
	verified?: boolean;
	popular?: boolean;
}

/**
 * Pagination info
 */
export interface RegistryPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

/**
 * Category info for display
 */
export interface CategoryInfo {
	id: PluginCategory;
	name: string;
	iconKey: string;
	count: number;
}

/**
 * Category icon keys for use with CategoryIcon component
 */
export type CategoryIconKey =
	| "admin"
	| "economy"
	| "permissions"
	| "world"
	| "gameplay"
	| "chat"
	| "protection"
	| "utility"
	| "library"
	| "performance"
	| "cosmetic"
	| "minigames"
	| "social";

/**
 * Category display configuration
 */
export const CATEGORY_INFO: Record<PluginCategory, { name: string; iconKey: CategoryIconKey }> = {
	admin: { name: "Admin Tools", iconKey: "admin" },
	economy: { name: "Economy", iconKey: "economy" },
	permissions: { name: "Permissions", iconKey: "permissions" },
	world: { name: "World Management", iconKey: "world" },
	gameplay: { name: "Gameplay", iconKey: "gameplay" },
	chat: { name: "Chat", iconKey: "chat" },
	protection: { name: "Protection", iconKey: "protection" },
	utility: { name: "Utility", iconKey: "utility" },
	library: { name: "Libraries", iconKey: "library" },
	performance: { name: "Performance", iconKey: "performance" },
	cosmetic: { name: "Cosmetics", iconKey: "cosmetic" },
	minigames: { name: "Minigames", iconKey: "minigames" },
	social: { name: "Social", iconKey: "social" },
};

/**
 * Source display configuration
 */
export const SOURCE_INFO: Record<PluginSourceType, { name: string; color: string; icon: string }> = {
	modrinth: { name: "Modrinth", color: "#1bd96a", icon: "modrinth" },
	hangar: { name: "Hangar", color: "#1e88e5", icon: "hangar" },
	spigot: { name: "SpigotMC", color: "#f69823", icon: "spigot" },
	curseforge: { name: "CurseForge", color: "#f16436", icon: "curseforge" },
	github: { name: "GitHub", color: "#6e5494", icon: "github" },
	jenkins: { name: "Jenkins", color: "#d33833", icon: "jenkins" },
	"web-manifest": { name: "Direct Download", color: "#6b7280", icon: "download" },
};

/**
 * Get URL for a plugin source
 */
export function getSourceUrl(source: RegistryPluginSource): string | null {
	switch (source.type) {
		case "modrinth":
			return source.projectSlug ? `https://modrinth.com/plugin/${source.projectSlug}` : null;
		case "hangar":
			return source.hangarSlug ? `https://hangar.papermc.io/plugins/${source.hangarSlug}` : null;
		case "spigot":
			return source.resourceId ? `https://www.spigotmc.org/resources/${source.resourceId}/` : null;
		case "curseforge":
			return source.curseforgeId
				? `https://www.curseforge.com/minecraft/bukkit-plugins/${source.curseforgeId}`
				: null;
		case "github":
			return source.repoSlug ? `https://github.com/${source.repoSlug}` : null;
		case "jenkins":
			return source.jenkinsUrl && source.jenkinsJob
				? `${source.jenkinsUrl}/job/${source.jenkinsJob}`
				: null;
		default:
			return null;
	}
}
