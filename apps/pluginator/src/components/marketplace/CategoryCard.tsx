/**
 * Category Card
 *
 * Displays a category tile for the marketplace landing page
 */

import type { CategoryIconKey, CategoryInfo } from "@/types/registry";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryIcon } from "./CategoryIcons";

interface CategoryCardProps {
	category: CategoryInfo;
	className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
	return (
		<Link to={`/plugins/category/${category.id}`}>
			<motion.div
				whileHover={{ scale: 1.02, y: -2 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					"group relative overflow-hidden rounded-xl border border-border bg-card p-4",
					"transition-colors hover:border-primary/50 hover:bg-card/80",
					className,
				)}
			>
				{/* Background gradient accent */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

				<div className="relative flex items-center justify-between">
					<div className="flex items-center gap-3">
						{/* Icon */}
						<div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
							<CategoryIcon iconKey={category.iconKey as CategoryIconKey} className="h-5 w-5" />
						</div>

						{/* Name and count */}
						<div>
							<h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
								{category.name}
							</h3>
							<p className="text-sm text-muted-foreground">
								{category.count} {category.count === 1 ? "plugin" : "plugins"}
							</p>
						</div>
					</div>

					{/* Arrow */}
					<ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
				</div>
			</motion.div>
		</Link>
	);
}

/**
 * Category grid wrapper
 */
export function CategoryGrid({
	categories,
	className,
}: {
	categories: CategoryInfo[];
	className?: string;
}) {
	return (
		<div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
			{categories.map((category) => (
				<CategoryCard key={category.id} category={category} />
			))}
		</div>
	);
}
