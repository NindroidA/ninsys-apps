/**
 * Plugin Category Page
 *
 * Browse plugins filtered by a specific category
 */

import {
	CategoryIcon,
	PluginGrid,
	PluginGridSkeleton,
	PluginSearch,
} from "@/components/marketplace";
import { useMinecraftVersions, useRegistryPlugins } from "@/hooks/useRegistry";
import { CATEGORY_INFO } from "@/types/registry";
import type { PluginCategory, RegistryFilters } from "@/types/registry";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { ArrowLeft, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export function PluginCategoryPage() {
	const { category } = useParams<{ category: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	// Validate category
	const isValidCategory = category && category in CATEGORY_INFO;
	const categoryInfo = isValidCategory
		? CATEGORY_INFO[category as PluginCategory]
		: null;

	// Parse filters from URL (excluding category which comes from route)
	const initialFilters: RegistryFilters = {
		category: category as PluginCategory,
		search: searchParams.get("search") || undefined,
		mcVersion: searchParams.get("mcVersion") || undefined,
		sort: (searchParams.get("sort") as RegistryFilters["sort"]) || "name",
		verified: searchParams.get("verified") === "true",
	};

	const [filters, setFilters] = useState<RegistryFilters>(initialFilters);
	const [page, setPage] = useState(1);

	const { data: mcVersions } = useMinecraftVersions();
	const { data, isLoading, error } = useRegistryPlugins({
		filters: { ...filters, category: category as PluginCategory },
		page,
		limit: 18,
	});

	const handleFiltersChange = useCallback(
		(newFilters: RegistryFilters) => {
			// Keep the category from the route
			setFilters({ ...newFilters, category: category as PluginCategory });
			setPage(1);

			// Update URL params (excluding category)
			const params = new URLSearchParams();
			if (newFilters.search) params.set("search", newFilters.search);
			if (newFilters.mcVersion) params.set("mcVersion", newFilters.mcVersion);
			if (newFilters.sort && newFilters.sort !== "name") params.set("sort", newFilters.sort);
			if (newFilters.verified) params.set("verified", "true");

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
					<Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
					<p className="text-muted-foreground mb-6">
						The category "{category}" doesn't exist.
					</p>
					<Link to="/marketplace">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Marketplace
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
						<Link to="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<span>/</span>
						<Link to="/plugins" className="hover:text-foreground transition-colors">
							Plugin Registry
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
								<CategoryIcon iconKey={categoryInfo.iconKey} className="h-6 w-6" />
							</div>
						)}
						<h1 className="text-2xl sm:text-3xl font-bold">{categoryInfo?.name}</h1>
						{data && (
							<span className="text-muted-foreground">
								({data.pagination.total} {data.pagination.total === 1 ? "plugin" : "plugins"})
							</span>
						)}
					</div>
				</FadeIn>

				{/* Search and Filters (without category dropdown) */}
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
								No {categoryInfo?.name.toLowerCase()} plugins match your filters
							</p>
							<Button
								variant="outline"
								onClick={() => handleFiltersChange({ category: category as PluginCategory })}
							>
								Clear Filters
							</Button>
						</div>
					</FadeIn>
				)}

				{/* Plugin Grid */}
				{!isLoading && !error && data && data.plugins.length > 0 && (
					<FadeIn delay={0.3}>
						<PluginGrid plugins={data.plugins} className="mb-8" />

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
											return (
												p === 1 ||
												p === data.pagination.totalPages ||
												Math.abs(p - page) <= 1
											);
										})
										.map((p, idx, arr) => {
											const prevPage = arr[idx - 1];
											const showEllipsisBefore = idx > 0 && prevPage !== undefined && p - prevPage > 1;

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
