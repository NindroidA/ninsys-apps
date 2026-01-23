import { cn } from "../lib/utils";
import { Blocks } from "lucide-react";
import type { ReactNode } from "react";
import {
	SiBiome,
	SiFramer,
	SiReact,
	SiReactquery,
	SiReactrouter,
	SiTailwindcss,
	SiTypescript,
	SiVite,
} from "react-icons/si";

export interface TechBadgeProps {
	/** The technology name to display */
	name: string;
	/** Optional custom icon (overrides automatic icon detection) */
	icon?: ReactNode;
	/** Optional custom brand color (overrides automatic color detection) */
	color?: string;
	/** Additional className for the badge */
	className?: string;
}

// Brand colors for popular technologies (glow and icon colors)
const techConfig: Record<string, { icon: ReactNode; color: string }> = {
	react: {
		icon: <SiReact />,
		color: "#61DAFB",
	},
	typescript: {
		icon: <SiTypescript />,
		color: "#3178C6",
	},
	tailwind: {
		icon: <SiTailwindcss />,
		color: "#06B6D4",
	},
	vite: {
		icon: <SiVite />,
		color: "#646CFF",
	},
	biome: {
		icon: <SiBiome />,
		color: "#60A5FA",
	},
	tanstack: {
		icon: <SiReactquery />,
		color: "#FF4154",
	},
	zustand: {
		icon: <Blocks className="h-3.5 w-3.5" />,
		color: "#764ABC",
	},
	framer: {
		icon: <SiFramer />,
		color: "#0055FF",
	},
	"react router": {
		icon: <SiReactrouter />,
		color: "#CA4245",
	},
	lucide: {
		icon: <Blocks className="h-3.5 w-3.5" />,
		color: "#F56565",
	},
};

/**
 * Detects the technology from the name string and returns matching config
 */
function detectTech(name: string): { icon: ReactNode; color: string } | null {
	const lowerName = name.toLowerCase();

	for (const [key, config] of Object.entries(techConfig)) {
		if (lowerName.includes(key)) {
			return config;
		}
	}

	return null;
}

/**
 * TechBadge - A badge component for displaying technology stack items with icons and brand-colored glow effects.
 *
 * Automatically detects and applies icons/colors for common technologies:
 * - React, TypeScript, Tailwind CSS, Vite, Biome
 * - TanStack Query, Zustand, Framer Motion
 * - React Router, Lucide Icons
 *
 * @example
 * ```tsx
 * <TechBadge name="React 19" />
 * <TechBadge name="TypeScript 5.7" />
 * <TechBadge name="Custom Tech" icon={<CustomIcon />} color="#FF0000" />
 * ```
 */
export function TechBadge({ name, icon, color, className }: TechBadgeProps) {
	const detected = detectTech(name);
	const finalIcon = icon ?? detected?.icon;
	const finalColor = color ?? detected?.color ?? "#888888";

	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 px-4 py-2 rounded-lg",
				"bg-card border border-border",
				"text-sm font-medium text-foreground",
				"transition-all duration-300",
				"hover:scale-105",
				className,
			)}
			style={{
				boxShadow: `0 0 20px ${finalColor}30, 0 0 40px ${finalColor}15`,
				borderColor: `${finalColor}40`,
			}}
		>
			{finalIcon && (
				<span className="shrink-0 text-base" style={{ color: finalColor }}>
					{finalIcon}
				</span>
			)}
			{name}
		</span>
	);
}
