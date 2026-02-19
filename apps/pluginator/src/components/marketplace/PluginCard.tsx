/**
 * Plugin Card
 *
 * Card component for displaying a plugin in grid/list views
 */

import { CATEGORY_INFO } from "@/types/registry";
import type { RegistryPlugin } from "@/types/registry";
import { Badge } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryIcon } from "./CategoryIcons";
import { PluginSourceIcons } from "./PluginSourceBadge";

interface PluginCardProps {
	plugin: RegistryPlugin;
	className?: string;
}

export function PluginCard({ plugin, className }: PluginCardProps) {
	const categoryInfo = CATEGORY_INFO[plugin.category];

	// Truncate description
	const maxDescLength = 80;
	const description =
		plugin.description.length > maxDescLength
			? `${plugin.description.slice(0, maxDescLength)}...`
			: plugin.description;

	return (
		<Link to={`/plugins/${plugin.id}`}>
			<motion.article
				whileHover={{ scale: 1.01, y: -2 }}
				whileTap={{ scale: 0.99 }}
				className={cn(
					"group relative flex flex-col h-full rounded-xl overflow-hidden",
					"bg-gradient-to-br from-card via-card to-muted/20",
					"border border-border/60 hover:border-primary/50",
					"transition-all duration-300",
					"hover:shadow-lg hover:shadow-primary/5",
					className,
				)}
			>
				{/* Subtle glow effect on hover */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Popular badge */}
				{plugin.popular && (
					<div className="absolute top-2 right-2 z-10">
						<Badge variant="primary" className="bg-gradient-to-r from-primary to-primary/80 text-xs shadow-sm">
							Popular
						</Badge>
					</div>
				)}

				{/* Content */}
				<div className="relative flex flex-col flex-1 p-4">
					{/* Header */}
					<div className="flex items-start gap-2 mb-2">
						<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex-1 line-clamp-1">
							{plugin.name}
						</h3>

						{/* Badges */}
						<div className="flex items-center gap-1 shrink-0">
							{plugin.verified && (
								<span title="Verified plugin">
									<BadgeCheck className="h-4 w-4 text-primary" />
								</span>
							)}
							{plugin.premium && (
								<span title="Premium plugin">
									<Crown className="h-4 w-4 text-amber-500" />
								</span>
							)}
						</div>
					</div>

					{/* Description */}
					<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
						{description}
					</p>

					{/* Metadata row */}
					<div className="flex items-center gap-2 flex-wrap mb-3">
						{/* Category */}
						<Badge variant="secondary" className="text-xs flex items-center gap-1.5">
							<CategoryIcon iconKey={plugin.category} className="h-3.5 w-3.5" />
							{categoryInfo.name}
						</Badge>

						{/* MC Version */}
						<span className="text-xs text-muted-foreground">
							{plugin.minecraftVersions.min} - {plugin.minecraftVersions.max}
						</span>

						{/* Downloads */}
						{(plugin.downloads ?? 0) > 0 && (
							<span className="text-xs text-muted-foreground flex items-center gap-1">
								<Download className="h-3 w-3" />
								{formatDownloads(plugin.downloads!)}
							</span>
						)}
					</div>

					{/* Footer - Sources (mt-auto pins to bottom) */}
					<div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
						<PluginSourceIcons sources={plugin.sources} maxVisible={3} />

						{/* Authors (truncated) */}
						<span className="text-xs text-muted-foreground truncate max-w-[120px]">
							by {plugin.authors.slice(0, 2).join(", ")}
							{plugin.authors.length > 2 && ` +${plugin.authors.length - 2}`}
						</span>
					</div>
				</div>
			</motion.article>
		</Link>
	);
}

/**
 * Format download count for display
 */
function formatDownloads(count: number): string {
	if (count >= 1_000_000) {
		return `${(count / 1_000_000).toFixed(1)}M`;
	}
	if (count >= 1_000) {
		return `${(count / 1_000).toFixed(1)}K`;
	}
	return count.toString();
}

/**
 * Plugin card grid wrapper with animations
 */
export function PluginGrid({
	plugins,
	className,
}: {
	plugins: RegistryPlugin[];
	className?: string;
}) {
	return (
		<motion.div
			className={cn(
				"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
				className,
			)}
			initial={false}
		>
			{plugins.map((plugin, index) => (
				<motion.div
					key={plugin.id}
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
					<PluginCard plugin={plugin} />
				</motion.div>
			))}
		</motion.div>
	);
}

/**
 * Loading skeleton for plugin card
 */
export function PluginCardSkeleton() {
	return (
		<div className="rounded-xl border border-border bg-card p-4 animate-pulse">
			<div className="flex items-start gap-2 mb-2">
				<div className="h-5 bg-muted rounded w-32" />
				<div className="h-4 w-4 bg-muted rounded-full ml-auto" />
			</div>
			<div className="space-y-2 mb-3">
				<div className="h-4 bg-muted rounded w-full" />
				<div className="h-4 bg-muted rounded w-3/4" />
			</div>
			<div className="flex items-center gap-2 mb-3">
				<div className="h-5 bg-muted rounded w-20" />
				<div className="h-4 bg-muted rounded w-16" />
			</div>
			<div className="flex items-center justify-between pt-2 border-t border-border/50">
				<div className="flex gap-1">
					<div className="h-6 w-6 bg-muted rounded" />
					<div className="h-6 w-6 bg-muted rounded" />
				</div>
				<div className="h-4 bg-muted rounded w-20" />
			</div>
		</div>
	);
}

/**
 * Plugin grid with loading skeletons
 */
export function PluginGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<PluginCardSkeleton key={i} />
			))}
		</div>
	);
}
