/**
 * Theme Category Page
 *
 * Browse themes filtered by a specific category.
 */

import {
	ThemeCategoryIcon,
	ThemeGrid,
	ThemeGridSkeleton,
	ThemeSearch,
} from "@/components/marketplace";
import { useRegistryThemes } from "@/hooks/useThemes";
import { THEME_CATEGORY_INFO } from "@/types/theme";
import type { ThemeCategory, ThemeFilters } from "@/types/theme";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ArrowLeft, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export function ThemeCategoryPage() {
	const { category } = useParams<{ category: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	// Validate category
	const isValidCategory = category && category in THEME_CATEGORY_INFO;
	const categoryInfo = isValidCategory ? THEME_CATEGORY_INFO[category as ThemeCategory] : null;

	// Parse filters from URL (excluding category which comes from route)
	const initialFilters: ThemeFilters = {
		category: category as ThemeCategory,
		search: searchParams.get("search") || undefined,
		type: (searchParams.get("type") as ThemeFilters["type"]) || undefined,
		tier: (searchParams.get("tier") as ThemeFilters["tier"]) || undefined,
		sort: (searchParams.get("sort") as ThemeFilters["sort"]) || "name",
	};

	const [filters, setFilters] = useState<ThemeFilters>(initialFilters);
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useRegistryThemes({
		filters: { ...filters, category: category as ThemeCategory },
		page,
		limit: 18,
	});

	const handleFiltersChange = useCallback(
		(newFilters: ThemeFilters) => {
			// Keep the category from the route
			setFilters({ ...newFilters, category: category as ThemeCategory });
			setPage(1);

			// Update URL params (excluding category)
			const params = new URLSearchParams();
			if (newFilters.search) params.set("search", newFilters.search);
			if (newFilters.type) params.set("type", newFilters.type);
			if (newFilters.tier) params.set("tier", newFilters.tier);
			if (newFilters.sort && newFilters.sort !== "name") params.set("sort", newFilters.sort);

			setSearchParams(params, { replace: true });
		},
		[category, setSearchParams],
	);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Invalid category
	if (!isValidCategory) {
		return (
			<div className="min-h-screen py-16">
				<div className="container mx-auto px-4 text-center">
					<Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
					<p className="text-muted-foreground mb-6">The category "{category}" doesn't exist.</p>
					<Link to="/marketplace/themes">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Themes
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4">
				{/* Breadcrumb */}
				<FadeIn>
					<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
						<Link to="/marketplace" className="hover:text-foreground transition-colors">
							Marketplace
						</Link>
						<span>/</span>
						<Link to="/marketplace/themes" className="hover:text-foreground transition-colors">
							Themes
						</Link>
						<span>/</span>
						<span className="text-foreground">{categoryInfo?.name}</span>
					</nav>
				</FadeIn>

				{/* Header */}
				<FadeIn delay={0.1}>
					<div className="flex items-center gap-3 mb-6">
						{categoryInfo && (
							<div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
								<ThemeCategoryIcon iconKey={categoryInfo.iconKey} className="h-6 w-6" />
							</div>
						)}
						<h1 className="text-2xl sm:text-3xl font-bold">{categoryInfo?.name} Themes</h1>
						{data && (
							<span className="text-muted-foreground">
								({data.pagination.total} {data.pagination.total === 1 ? "theme" : "themes"})
							</span>
						)}
					</div>
					{categoryInfo?.description && (
						<p className="text-muted-foreground mb-6">{categoryInfo.description}</p>
					)}
				</FadeIn>

				{/* Search and Filters (without category dropdown) */}
				<FadeIn delay={0.2}>
					<ThemeSearch
						initialFilters={filters}
						onFiltersChange={handleFiltersChange}
						className="mb-8"
					/>
				</FadeIn>

				{/* Error state */}
				{error && (
					<div className="text-center py-12">
						<p className="text-destructive mb-4">Failed to load themes</p>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</div>
				)}

				{/* Loading state */}
				{isLoading && (
					<FadeIn delay={0.3}>
						<ThemeGridSkeleton count={18} />
					</FadeIn>
				)}

				{/* Empty state */}
				{!isLoading && !error && data?.themes.length === 0 && (
					<FadeIn delay={0.3}>
						<div className="text-center py-16">
							<Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No themes found</h3>
							<p className="text-muted-foreground mb-4">
								No {categoryInfo?.name.toLowerCase()} themes match your filters
							</p>
							<Button
								variant="outline"
								onClick={() => handleFiltersChange({ category: category as ThemeCategory })}
							>
								Clear Filters
							</Button>
						</div>
					</FadeIn>
				)}

				{/* Theme Grid */}
				{!isLoading && !error && data && data.themes.length > 0 && (
					<FadeIn delay={0.3}>
						<ThemeGrid themes={data.themes} className="mb-8" />

						{/* Pagination */}
						{data.pagination.totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 pt-8">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(page - 1)}
									disabled={page <= 1}
								>
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</Button>

								<div className="flex items-center gap-1">
									{Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
										.filter((p) => {
											return p === 1 || p === data.pagination.totalPages || Math.abs(p - page) <= 1;
										})
										.map((p, idx, arr) => {
											const prevPage = arr[idx - 1];
											const showEllipsisBefore =
												idx > 0 && prevPage !== undefined && p - prevPage > 1;

											return (
												<span key={p} className="flex items-center">
													{showEllipsisBefore && (
														<span className="px-2 text-muted-foreground">...</span>
													)}
													<Button
														variant={p === page ? "primary" : "outline"}
														size="sm"
														onClick={() => handlePageChange(p)}
														className="w-9"
													>
														{p}
													</Button>
												</span>
											);
										})}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(page + 1)}
									disabled={!data.pagination.hasMore}
								>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						)}
					</FadeIn>
				)}
			</div>
		</div>
	);
}
