/**
 * Theme Card Component
 *
 * Card display for themes in grid layouts with mini terminal preview.
 */

import type { RegistryTheme } from "@/types/theme";
import { THEME_TIER_INFO, THEME_TYPE_INFO } from "@/types/theme";
import { Badge } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemePreview, ThemePreviewSkeleton } from "./ThemePreview";

interface ThemeCardProps {
	theme: RegistryTheme;
	className?: string;
}

export function ThemeCard({ theme, className }: ThemeCardProps) {
	const tierInfo = THEME_TIER_INFO[theme.minTier];

	return (
		<Link
			to={`/marketplace/themes/${theme.id}`}
			className={cn(
				"group block rounded-xl border border-border bg-card p-4 transition-all duration-200",
				"hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
				"hover:-translate-y-0.5",
				className,
			)}
		>
			{/* Terminal Preview */}
			<div className="flex justify-center mb-4">
				<ThemePreview theme={theme} size="sm" />
			</div>

			{/* Content */}
			<div className="space-y-2">
				{/* Name and badges row */}
				<div className="flex items-center gap-2 flex-wrap">
					<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
						{theme.name}
					</h3>
					{theme.verified && (
						<span title="Verified">
							<BadgeCheck className="h-4 w-4 text-primary" />
						</span>
					)}
				</div>

				{/* Author */}
				<p className="text-sm text-muted-foreground">by {theme.author}</p>

				{/* Badges row */}
				<div className="flex items-center gap-2 flex-wrap">
					{/* Tier badge */}
					<Badge
						variant="secondary"
						className={cn("text-xs", tierInfo.bgColor, tierInfo.color)}
					>
						{theme.minTier === "max" && <Crown className="h-3 w-3 mr-1" />}
						{tierInfo.name}
					</Badge>

					{/* Type badge */}
					<Badge variant="outline" className="text-xs">
						{theme.type === "dark" ? (
							<Moon className="h-3 w-3 mr-1" />
						) : (
							<Sun className="h-3 w-3 mr-1" />
						)}
						{THEME_TYPE_INFO[theme.type].name}
					</Badge>
				</div>

				{/* Stats (if available) */}
				{(theme.downloads || theme.rating) && (
					<div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
						{theme.downloads && (
							<span>{theme.downloads.toLocaleString()} downloads</span>
						)}
						{theme.rating && <span>★ {theme.rating.toFixed(1)}</span>}
					</div>
				)}
			</div>
		</Link>
	);
}

/**
 * Grid layout for theme cards with animations
 */
export function ThemeGrid({
	themes,
	className,
}: {
	themes: RegistryTheme[];
	className?: string;
}) {
	return (
		<motion.div
			className={cn(
				"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
				className,
			)}
			initial={false}
		>
			{themes.map((theme, index) => (
				<motion.div
					key={theme.id}
					initial={{ opacity: 0, y: 20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{
						duration: 0.2,
						delay: index * 0.03,
						ease: "easeOut",
					}}
					layout
				>
					<ThemeCard theme={theme} />
				</motion.div>
			))}
		</motion.div>
	);
}

/**
 * Skeleton loader for theme card
 */
export function ThemeCardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card p-4 animate-pulse",
				className,
			)}
		>
			{/* Preview skeleton */}
			<div className="flex justify-center mb-4">
				<ThemePreviewSkeleton size="sm" />
			</div>

			{/* Content skeleton */}
			<div className="space-y-2">
				<div className="h-5 w-32 bg-muted rounded" />
				<div className="h-4 w-24 bg-muted rounded" />
				<div className="flex gap-2">
					<div className="h-5 w-16 bg-muted rounded" />
					<div className="h-5 w-14 bg-muted rounded" />
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton grid for loading state
 */
export function ThemeGridSkeleton({
	count = 6,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
				className,
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<ThemeCardSkeleton key={i} />
			))}
		</div>
	);
}
