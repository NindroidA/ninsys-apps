/**
 * Theme Gallery Page
 *
 * Browse all themes with search, filters, and pagination.
 */

import { ThemeGrid, ThemeGridSkeleton, ThemeSearch } from "@/components/marketplace";
import { useRegistryThemes } from "@/hooks/useThemes";
import type { ThemeFilters } from "@/types/theme";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function ThemeGalleryPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Parse initial filters from URL
	const initialFilters: ThemeFilters = {
		search: searchParams.get("search") || undefined,
		type: (searchParams.get("type") as ThemeFilters["type"]) || undefined,
		category: (searchParams.get("category") as ThemeFilters["category"]) || undefined,
		tier: (searchParams.get("tier") as ThemeFilters["tier"]) || undefined,
		sort: (searchParams.get("sort") as ThemeFilters["sort"]) || "name",
	};

	const [filters, setFilters] = useState<ThemeFilters>(initialFilters);
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useRegistryThemes({
		filters,
		page,
		limit: 18,
	});

	// Update URL when filters change
	const handleFiltersChange = useCallback(
		(newFilters: ThemeFilters) => {
			setFilters(newFilters);
			setPage(1);

			// Update URL params
			const params = new URLSearchParams();
			if (newFilters.search) params.set("search", newFilters.search);
			if (newFilters.type) params.set("type", newFilters.type);
			if (newFilters.category) params.set("category", newFilters.category);
			if (newFilters.tier) params.set("tier", newFilters.tier);
			if (newFilters.sort && newFilters.sort !== "name") params.set("sort", newFilters.sort);

			setSearchParams(params, { replace: true });
		},
		[setSearchParams],
	);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Build page title based on filters
	let pageTitle = "Theme Gallery";
	if (filters.search) {
		pageTitle = `Search: "${filters.search}"`;
	} else if (filters.type) {
		pageTitle = `${filters.type === "dark" ? "Dark" : "Light"} Themes`;
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
						<span className="text-foreground">Themes</span>
					</nav>
				</FadeIn>

				{/* Header */}
				<FadeIn delay={0.1}>
					<div className="flex items-center gap-3 mb-6">
						<Palette className="h-6 w-6 text-primary" />
						<h1 className="text-2xl sm:text-3xl font-bold">{pageTitle}</h1>
						{data && (
							<span className="text-muted-foreground">
								({data.pagination.total} {data.pagination.total === 1 ? "theme" : "themes"})
							</span>
						)}
					</div>
				</FadeIn>

				{/* Search and Filters */}
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
							<p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
							<Button variant="outline" onClick={() => handleFiltersChange({})}>
								Clear Filters
							</Button>
						</div>
					</FadeIn>
				)}

				{/* Theme Grid */}
				{!isLoading && !error && data && data.themes.length > 0 && (
					<FadeIn delay={0.3}>
						{/* Results count with animation */}
						<AnimatePresence mode="wait">
							<motion.p
								key={`count-${data.pagination.total}-${filters.search || ""}-${filters.type || ""}`}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="text-sm text-muted-foreground mb-4"
							>
								Showing {data.themes.length} of {data.pagination.total} themes
							</motion.p>
						</AnimatePresence>
						<AnimatePresence mode="wait">
							<motion.div
								key={`grid-${data.themes.map((t) => t.id).join("-")}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
							>
								<ThemeGrid themes={data.themes} className="mb-8" />
							</motion.div>
						</AnimatePresence>

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

								<div className="flex items-center gap-1.5">
									{Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
										.filter((p) => {
											return p === 1 || p === data.pagination.totalPages || Math.abs(p - page) <= 1;
										})
										.map((p, idx, arr) => {
											const prevPage = arr[idx - 1];
											const showEllipsisBefore =
												idx > 0 && prevPage !== undefined && p - prevPage > 1;

											return (
												<span key={p} className="flex items-center gap-1.5">
													{showEllipsisBefore && (
														<span className="px-1.5 text-muted-foreground">...</span>
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
