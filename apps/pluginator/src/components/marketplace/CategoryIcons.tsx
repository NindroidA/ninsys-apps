/**
 * Category Icons
 *
 * Icon components for plugin categories and theme categories.
 * Uses Lucide React icons with distinct colors for differentiation.
 */

import type { CategoryIconKey } from "@/types/registry";
import type { ThemeCategoryIconKey, ThemeTypeIconKey } from "@/types/theme";
import { cn } from "@ninsys/ui/lib";
import {
	Accessibility,
	BookOpen,
	Coins,
	Gamepad2,
	Globe,
	Key,
	MessageCircle,
	Moon,
	Palette,
	Settings,
	Shield,
	Snowflake,
	Sparkles,
	Sun,
	Target,
	Users,
	Wrench,
	Zap,
} from "lucide-react";

interface IconProps {
	className?: string;
}

/**
 * Default colors for each plugin category
 */
export const CATEGORY_COLORS: Record<CategoryIconKey, string> = {
	admin: "text-slate-400",
	economy: "text-amber-500",
	permissions: "text-yellow-500",
	world: "text-emerald-500",
	gameplay: "text-rose-500",
	chat: "text-sky-400",
	protection: "text-blue-500",
	utility: "text-orange-400",
	library: "text-violet-400",
	performance: "text-yellow-400",
	cosmetic: "text-pink-400",
	minigames: "text-green-400",
	social: "text-cyan-400",
};

/**
 * Default colors for each theme category
 */
export const THEME_CATEGORY_COLORS: Record<ThemeCategoryIconKey, string> = {
	default: "text-violet-400",
	designer: "text-amber-400",
	accessibility: "text-blue-400",
	seasonal: "text-sky-300",
	community: "text-green-400",
};

/**
 * Default colors for theme types
 */
export const THEME_TYPE_COLORS: Record<ThemeTypeIconKey, string> = {
	dark: "text-indigo-400",
	light: "text-amber-400",
};

/**
 * Plugin category icons
 */
const CATEGORY_ICONS: Record<CategoryIconKey, React.FC<IconProps>> = {
	admin: ({ className }) => <Settings className={cn("h-4 w-4", className)} />,
	economy: ({ className }) => <Coins className={cn("h-4 w-4", className)} />,
	permissions: ({ className }) => <Key className={cn("h-4 w-4", className)} />,
	world: ({ className }) => <Globe className={cn("h-4 w-4", className)} />,
	gameplay: ({ className }) => <Target className={cn("h-4 w-4", className)} />,
	chat: ({ className }) => <MessageCircle className={cn("h-4 w-4", className)} />,
	protection: ({ className }) => <Shield className={cn("h-4 w-4", className)} />,
	utility: ({ className }) => <Wrench className={cn("h-4 w-4", className)} />,
	library: ({ className }) => <BookOpen className={cn("h-4 w-4", className)} />,
	performance: ({ className }) => <Zap className={cn("h-4 w-4", className)} />,
	cosmetic: ({ className }) => <Sparkles className={cn("h-4 w-4", className)} />,
	minigames: ({ className }) => <Gamepad2 className={cn("h-4 w-4", className)} />,
	social: ({ className }) => <Users className={cn("h-4 w-4", className)} />,
};

/**
 * Theme category icons
 */
const THEME_CATEGORY_ICONS: Record<ThemeCategoryIconKey, React.FC<IconProps>> = {
	default: ({ className }) => <Palette className={cn("h-4 w-4", className)} />,
	designer: ({ className }) => <Sparkles className={cn("h-4 w-4", className)} />,
	accessibility: ({ className }) => <Accessibility className={cn("h-4 w-4", className)} />,
	seasonal: ({ className }) => <Snowflake className={cn("h-4 w-4", className)} />,
	community: ({ className }) => <Users className={cn("h-4 w-4", className)} />,
};

/**
 * Theme type icons
 */
const THEME_TYPE_ICONS: Record<ThemeTypeIconKey, React.FC<IconProps>> = {
	dark: ({ className }) => <Moon className={cn("h-4 w-4", className)} />,
	light: ({ className }) => <Sun className={cn("h-4 w-4", className)} />,
};

/**
 * Plugin category icon component with default color
 */
export function CategoryIcon({
	iconKey,
	className,
	colored = true,
}: {
	iconKey: CategoryIconKey;
	className?: string;
	colored?: boolean;
}) {
	const IconComponent = CATEGORY_ICONS[iconKey];
	return <IconComponent className={cn(colored && CATEGORY_COLORS[iconKey], className)} />;
}

/**
 * Theme category icon component with default color
 */
export function ThemeCategoryIcon({
	iconKey,
	className,
	colored = true,
}: {
	iconKey: ThemeCategoryIconKey;
	className?: string;
	colored?: boolean;
}) {
	const IconComponent = THEME_CATEGORY_ICONS[iconKey];
	return <IconComponent className={cn(colored && THEME_CATEGORY_COLORS[iconKey], className)} />;
}

/**
 * Theme type icon component with default color
 */
export function ThemeTypeIcon({
	iconKey,
	className,
	colored = true,
}: {
	iconKey: ThemeTypeIconKey;
	className?: string;
	colored?: boolean;
}) {
	const IconComponent = THEME_TYPE_ICONS[iconKey];
	return <IconComponent className={cn(colored && THEME_TYPE_COLORS[iconKey], className)} />;
}
