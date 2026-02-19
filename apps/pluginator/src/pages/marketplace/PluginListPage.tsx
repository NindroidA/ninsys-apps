/**
 * Plugin List Page
 *
 * Browse all plugins with search, filters, and pagination
 */

import {
	PluginGrid,
	PluginGridSkeleton,
	PluginSearch,
} from "@/components/marketplace";
import { useMinecraftVersions, useRegistryPlugins } from "@/hooks/useRegistry";
import type { RegistryFilters } from "@/types/registry";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function PluginListPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Parse initial filters from URL
	const initialFilters: RegistryFilters = {
		search: searchParams.get("search") || undefined,
		category: (searchParams.get("category") as RegistryFilters["category"]) || undefined,
		mcVersion: searchParams.get("mcVersion") || undefined,
		sort: (searchParams.get("sort") as RegistryFilters["sort"]) || "name",
		verified: searchParams.get("verified") === "true",
		popular: searchParams.get("popular") === "true",
	};

	const [filters, setFilters] = useState<RegistryFilters>(initialFilters);
	const [page, setPage] = useState(1);

	const { data: mcVersions } = useMinecraftVersions();
	const { data, isLoading, error } = useRegistryPlugins({
		filters,
		page,
		limit: 18,
	});

	// Update URL when filters change
	const handleFiltersChange = useCallback(
		(newFilters: RegistryFilters) => {
			setFilters(newFilters);
			setPage(1);

			// Update URL params
			const params = new URLSearchParams();
			if (newFilters.search) params.set("search", newFilters.search);
			if (newFilters.category) params.set("category", newFilters.category);
			if (newFilters.mcVersion) params.set("mcVersion", newFilters.mcVersion);
			if (newFilters.sort && newFilters.sort !== "name") params.set("sort", newFilters.sort);
			if (newFilters.verified) params.set("verified", "true");
			if (newFilters.popular) params.set("popular", "true");

			setSearchParams(params, { replace: true });
		},
		[setSearchParams],
	);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Build page title based on filters
	let pageTitle = "Browse Plugins";
	if (filters.search) {
		pageTitle = `Search: "${filters.search}"`;
	} else if (filters.popular) {
		pageTitle = "Popular Plugins";
	} else if (filters.verified) {
		pageTitle = "Verified Plugins";
	}

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4">
				{/* Breadcrumb */}
				<FadeIn>
					<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
						<Link to="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<span>/</span>
						<span className="text-foreground">Plugin Registry</span>
					</nav>
				</FadeIn>

				{/* Header */}
				<FadeIn delay={0.1}>
					<div className="flex items-center gap-3 mb-6">
						<Package className="h-6 w-6 text-primary" />
						<AnimatePresence mode="wait">
							<motion.h1
								key={pageTitle}
								initial={{ opacity: 0, y: -8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 8 }}
								transition={{ duration: 0.2 }}
								className="text-2xl sm:text-3xl font-bold"
							>
								{pageTitle}
							</motion.h1>
						</AnimatePresence>
						{data && (
							<AnimatePresence mode="wait">
								<motion.span
									key={data.pagination.total}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-muted-foreground"
								>
									({data.pagination.total} {data.pagination.total === 1 ? "plugin" : "plugins"})
								</motion.span>
							</AnimatePresence>
						)}
					</div>
				</FadeIn>

				{/* Search and Filters */}
				<FadeIn delay={0.2}>
					<PluginSearch
						initialFilters={filters}
						mcVersions={mcVersions}
						onFiltersChange={handleFiltersChange}
						className="mb-8"
					/>
				</FadeIn>

				{/* Error state */}
				{error && (
					<div className="text-center py-12">
						<p className="text-destructive mb-4">Failed to load plugins</p>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</div>
				)}

				{/* Loading state */}
				{isLoading && (
					<FadeIn delay={0.3}>
						<PluginGridSkeleton count={18} />
					</FadeIn>
				)}

				{/* Empty state */}
				{!isLoading && !error && data?.plugins.length === 0 && (
					<FadeIn delay={0.3}>
						<div className="text-center py-16">
							<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No plugins found</h3>
							<p className="text-muted-foreground mb-4">
								Try adjusting your search or filters
							</p>
							<Button
								variant="outline"
								onClick={() => handleFiltersChange({})}
							>
								Clear Filters
							</Button>
						</div>
					</FadeIn>
				)}

				{/* Plugin Grid */}
				{!isLoading && !error && data && data.plugins.length > 0 && (
					<FadeIn delay={0.3}>
						{/* Results count with animation */}
						<AnimatePresence mode="wait">
							<motion.p
								key={`count-${data.pagination.total}-${filters.search || ''}-${filters.category || ''}-${filters.sort || ''}-${filters.verified || ''}`}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="text-sm text-muted-foreground mb-4"
							>
								Showing {data.plugins.length} of {data.pagination.total} plugins
							</motion.p>
						</AnimatePresence>
						<AnimatePresence mode="wait">
							<motion.div
								key={`grid-${data.plugins.map(p => p.id).join('-')}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
							>
								<PluginGrid plugins={data.plugins} className="mb-8" />
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
											// Show first, last, current, and adjacent pages
											return (
												p === 1 ||
												p === data.pagination.totalPages ||
												Math.abs(p - page) <= 1
											);
										})
										.map((p, idx, arr) => {
											// Add ellipsis if there's a gap
											const prevPage = arr[idx - 1];
											const showEllipsisBefore = idx > 0 && prevPage !== undefined && p - prevPage > 1;

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
