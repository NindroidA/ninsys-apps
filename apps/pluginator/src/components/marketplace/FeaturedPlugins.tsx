/**
 * Featured Plugins Section
 *
 * Displays a row of popular/featured plugins
 */

import { useFeaturedPlugins } from "@/hooks/useRegistry";
import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PluginCard, PluginCardSkeleton } from "./PluginCard";

interface FeaturedPluginsProps {
	limit?: number;
	showViewAll?: boolean;
	className?: string;
}

export function FeaturedPlugins({
	limit = 6,
	showViewAll = true,
	className,
}: FeaturedPluginsProps) {
	const { data: plugins, isLoading, error } = useFeaturedPlugins(limit);

	if (error) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Failed to load featured plugins
			</div>
		);
	}

	return (
		<section className={cn("space-y-6", className)}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					<h2 className="text-xl font-semibold">Popular Plugins</h2>
				</div>

				{showViewAll && (
					<Link to="/plugins?popular=true">
						<Button variant="ghost" size="sm">
							View All
							<ArrowRight className="h-4 w-4 ml-1" />
						</Button>
					</Link>
				)}
			</div>

			{/* Grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: limit }).map((_, i) => (
						<PluginCardSkeleton key={i} />
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{plugins?.map((plugin) => (
						<PluginCard key={plugin.id} plugin={plugin} />
					))}
				</div>
			)}
		</section>
	);
}

/**
 * Horizontal scroll version for compact spaces
 */
export function FeaturedPluginsScroll({
	limit = 6,
	className,
}: {
	limit?: number;
	className?: string;
}) {
	const { data: plugins, isLoading } = useFeaturedPlugins(limit);

	return (
		<div className={cn("relative", className)}>
			<div className="overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
				<div className="flex gap-4 min-w-max">
					{isLoading
						? Array.from({ length: limit }).map((_, i) => (
								<div key={i} className="w-[300px] shrink-0">
									<PluginCardSkeleton />
								</div>
							))
						: plugins?.map((plugin) => (
								<div key={plugin.id} className="w-[300px] shrink-0">
									<PluginCard plugin={plugin} />
								</div>
							))}
				</div>
			</div>

			{/* Fade edges */}
			<div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
			<div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
		</div>
	);
}
