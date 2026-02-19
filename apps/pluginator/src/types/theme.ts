/**
 * Theme Gallery Types
 *
 * TypeScript types for the theme gallery marketplace feature.
 * Aligned with CLI theme types from ~/Desktop/GitHub-Repos/pluginator
 */

// =============================================================================
// Core Types
// =============================================================================

export type ThemeType = "dark" | "light";

export type ThemeCategory =
	| "default"
	| "designer"
	| "accessibility"
	| "seasonal"
	| "community";

export type ThemeTier = "free" | "plus" | "pro" | "max";

// =============================================================================
// Color Token Types
// =============================================================================

export interface BackgroundColors {
	/** Main application background */
	primary: string;
	/** Card/panel backgrounds */
	secondary: string;
	/** Nested element backgrounds */
	tertiary: string;
	/** Modal/dropdown backgrounds */
	elevated: string;
	/** Semi-transparent overlay for dimming */
	overlay: string;
}

export interface ForegroundColors {
	/** Main text color */
	primary: string;
	/** Subdued/secondary text */
	secondary: string;
	/** Disabled/hint text */
	tertiary: string;
	/** Text on colored backgrounds */
	inverse: string;
}

export interface AccentColors {
	/** Brand/focus color */
	primary: string;
	/** Hover state accent */
	secondary: string;
	/** Subtle accent for borders/dividers */
	muted: string;
}

export interface StatusColors {
	/** Success state (green) */
	success: string;
	/** Warning state (yellow/orange) */
	warning: string;
	/** Error state (red) */
	error: string;
	/** Info state (blue) */
	info: string;
}

export interface InteractiveColors {
	/** Default state */
	default: string;
	/** Hover state */
	hover: string;
	/** Active/pressed state */
	active: string;
	/** Disabled state */
	disabled: string;
}

export interface BorderColors {
	/** Default border */
	default: string;
	/** Subtle/light border */
	subtle: string;
	/** Strong/emphasis border */
	strong: string;
}

export interface SemanticColors {
	/** Background colors */
	bg: BackgroundColors;
	/** Foreground (text) colors */
	fg: ForegroundColors;
	/** Accent colors */
	accent: AccentColors;
	/** Status indicator colors */
	status: StatusColors;
	/** Interactive element colors */
	interactive: InteractiveColors;
	/** Border colors */
	border: BorderColors;
}

// =============================================================================
// Premium Feature Types
// =============================================================================

export interface GradientDefinition {
	/** Gradient type */
	type: "linear" | "radial";
	/** Color stops */
	stops: string[];
	/** Angle for linear gradients (degrees) */
	angle?: number;
}

export interface GradientSet {
	/** Primary gradient (headers, highlights) */
	primary?: GradientDefinition;
	/** Secondary gradient (accents) */
	secondary?: GradientDefinition;
	/** Background gradient */
	background?: GradientDefinition;
}

export interface AnimationSet {
	/** Enable gradient shimmer animations */
	shimmer?: boolean;
	/** Enable color cycling */
	colorCycle?: boolean;
	/** Animation speed multiplier (1.0 = normal) */
	speed?: number;
}

// =============================================================================
// Theme Definition
// =============================================================================

export interface RegistryTheme {
	/** Unique theme identifier (kebab-case) */
	id: string;
	/** Display name */
	name: string;
	/** Theme author */
	author: string;
	/** Optional description */
	description?: string;
	/** Light or dark theme */
	type: ThemeType;
	/** Theme category */
	category: ThemeCategory;
	/** Minimum tier required to use this theme */
	minTier: ThemeTier;
	/** Semantic color tokens */
	colors: SemanticColors;
	/** Optional gradients (premium feature) */
	gradients?: GradientSet;
	/** Optional animations (premium feature) */
	animations?: AnimationSet;
	/** Optional version for community themes */
	version?: string;
	/** Whether theme is verified */
	verified?: boolean;
	/** Whether theme is featured */
	featured?: boolean;
	/** Download count (for community themes) */
	downloads?: number;
	/** Rating (for community themes) */
	rating?: number;
}

// =============================================================================
// Filter & Pagination Types
// =============================================================================

export interface ThemeFilters {
	search?: string;
	type?: ThemeType;
	category?: ThemeCategory;
	tier?: ThemeTier;
	sort?: "name" | "newest" | "popular";
}

export interface ThemePagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

export interface ThemeCategoryInfo {
	id: ThemeCategory;
	name: string;
	iconKey: string;
	count: number;
}

// =============================================================================
// Display Configuration
// =============================================================================

/**
 * Theme category icon keys for use with ThemeCategoryIcon component
 */
export type ThemeCategoryIconKey =
	| "default"
	| "designer"
	| "accessibility"
	| "seasonal"
	| "community";

export const THEME_CATEGORY_INFO: Record<
	ThemeCategory,
	{ name: string; iconKey: ThemeCategoryIconKey; description: string }
> = {
	default: {
		name: "Default",
		iconKey: "default",
		description: "Core system themes",
	},
	designer: {
		name: "Designer",
		iconKey: "designer",
		description: "Professional and popular themes",
	},
	accessibility: {
		name: "Accessibility",
		iconKey: "accessibility",
		description: "High contrast and color-blind friendly",
	},
	seasonal: {
		name: "Seasonal",
		iconKey: "seasonal",
		description: "Limited-time holiday themes",
	},
	community: {
		name: "Community",
		iconKey: "community",
		description: "User-created themes",
	},
};

export const THEME_TIER_INFO: Record<
	ThemeTier,
	{ name: string; color: string; bgColor: string }
> = {
	free: {
		name: "Free",
		color: "text-muted-foreground",
		bgColor: "bg-muted",
	},
	plus: {
		name: "Plus",
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
	},
	pro: {
		name: "Pro",
		color: "text-purple-500",
		bgColor: "bg-purple-500/10",
	},
	max: {
		name: "Max",
		color: "text-amber-500",
		bgColor: "bg-amber-500/10",
	},
};

/**
 * Theme type icon keys
 */
export type ThemeTypeIconKey = "dark" | "light";

export const THEME_TYPE_INFO: Record<ThemeType, { name: string; iconKey: ThemeTypeIconKey }> = {
	dark: { name: "Dark", iconKey: "dark" },
	light: { name: "Light", iconKey: "light" },
};
