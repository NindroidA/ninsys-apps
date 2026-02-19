/**
 * Theme Search and Filters
 *
 * Search input and filter controls for the theme gallery.
 */

import { Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import {
	THEME_CATEGORY_INFO,
	THEME_TIER_INFO,
	THEME_TYPE_INFO,
} from "@/types/theme";
import type {
	ThemeCategory,
	ThemeFilters,
	ThemeTier,
	ThemeType,
} from "@/types/theme";
import { Button, Input } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import {
	Accessibility,
	Filter,
	Moon,
	Palette,
	Search,
	Snowflake,
	Sparkles,
	Sun,
	Users,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Icon mapping for theme types with colors
const THEME_TYPE_ICON_MAP: Record<ThemeType, React.ReactNode> = {
	dark: <Moon className="h-4 w-4 text-indigo-400" />,
	light: <Sun className="h-4 w-4 text-amber-400" />,
};

// Icon mapping for theme categories with colors
const THEME_CATEGORY_ICON_MAP: Record<ThemeCategory, React.ReactNode> = {
	default: <Palette className="h-4 w-4 text-violet-400" />,
	designer: <Sparkles className="h-4 w-4 text-amber-400" />,
	accessibility: <Accessibility className="h-4 w-4 text-blue-400" />,
	seasonal: <Snowflake className="h-4 w-4 text-sky-300" />,
	community: <Users className="h-4 w-4 text-green-400" />,
};

interface ThemeSearchProps {
	initialFilters?: ThemeFilters;
	onFiltersChange: (filters: ThemeFilters) => void;
	className?: string;
}

const SORT_OPTIONS: SelectOption[] = [
	{ value: "name", label: "Name A-Z" },
	{ value: "popular", label: "Most Popular" },
	{ value: "newest", label: "Newest" },
];

export function ThemeSearch({
	initialFilters = {},
	onFiltersChange,
	className,
}: ThemeSearchProps) {
	const [search, setSearch] = useState(initialFilters.search || "");
	const [type, setType] = useState<string>(initialFilters.type || "");
	const [category, setCategory] = useState<string>(initialFilters.category || "");
	const [tier, setTier] = useState<string>(initialFilters.tier || "");
	const [sort, setSort] = useState<string>(initialFilters.sort || "name");
	const [showFilters, setShowFilters] = useState(false);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			onFiltersChange({
				search: search || undefined,
				type: (type as ThemeType) || undefined,
				category: (category as ThemeCategory) || undefined,
				tier: (tier as ThemeTier) || undefined,
				sort: sort as ThemeFilters["sort"],
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [search, type, category, tier, sort, onFiltersChange]);

	const hasActiveFilters = type || category || tier;

	const clearFilters = () => {
		setType("");
		setCategory("");
		setTier("");
	};

	const typeOptions: SelectOption[] = useMemo(() => [
		{ value: "", label: "All Types" },
		...Object.entries(THEME_TYPE_INFO).map(([id, info]) => ({
			value: id,
			label: info.name,
			icon: THEME_TYPE_ICON_MAP[id as ThemeType],
		})),
	], []);

	const categoryOptions: SelectOption[] = useMemo(() => [
		{ value: "", label: "All Categories" },
		...Object.entries(THEME_CATEGORY_INFO).map(([id, info]) => ({
			value: id,
			label: info.name,
			icon: THEME_CATEGORY_ICON_MAP[id as ThemeCategory],
		})),
	], []);

	const tierOptions: SelectOption[] = useMemo(() => [
		{ value: "", label: "All Tiers" },
		...Object.entries(THEME_TIER_INFO).map(([id, info]) => ({
			value: id,
			label: info.name,
		})),
	], []);

	const sortOptions: SelectOption[] = useMemo(() => [
		{ value: "", label: "Sort By" },
		...SORT_OPTIONS,
	], []);

	return (
		<div className={cn("space-y-4", className)}>
			{/* Search bar row */}
			<div className="flex flex-col lg:flex-row gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 via-muted/30 to-transparent border border-border/50">
				{/* Search input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search themes..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Filter toggle (mobile/tablet) */}
				<Button
					variant="outline"
					onClick={() => setShowFilters(!showFilters)}
					className="lg:hidden"
				>
					<Filter className="h-4 w-4 mr-2" />
					Filters
					{hasActiveFilters && (
						<span className="ml-2 h-2 w-2 rounded-full bg-primary" />
					)}
				</Button>

				{/* Desktop filters inline */}
				<div className="hidden lg:flex items-center gap-2">
					{/* Type */}
					<Select
						value={type}
						onChange={setType}
						options={typeOptions}
						placeholder="All Types"
						className="w-32"
					/>

					{/* Category */}
					<Select
						value={category}
						onChange={setCategory}
						options={categoryOptions}
						placeholder="All Categories"
						className="w-40"
					/>

					{/* Tier */}
					<Select
						value={tier}
						onChange={setTier}
						options={tierOptions}
						placeholder="All Tiers"
						className="w-32"
					/>

					{/* Sort */}
					<Select
						value={sort}
						onChange={setSort}
						options={sortOptions}
						placeholder="Sort By"
						className="w-36"
					/>

					{/* Clear filters */}
					{hasActiveFilters && (
						<Button variant="ghost" size="sm" onClick={clearFilters}>
							<X className="h-4 w-4 mr-1" />
							Clear
						</Button>
					)}
				</div>
			</div>

			{/* Mobile/tablet filters panel */}
			{showFilters && (
				<div className="lg:hidden space-y-4 p-4 rounded-xl border border-border bg-card">
					{/* Type */}
					<div>
						<label className="block text-sm font-medium mb-2">Type</label>
						<Select
							value={type}
							onChange={setType}
							options={typeOptions}
							placeholder="All Types"
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-medium mb-2">Category</label>
						<Select
							value={category}
							onChange={setCategory}
							options={categoryOptions}
							placeholder="All Categories"
						/>
					</div>

					{/* Tier */}
					<div>
						<label className="block text-sm font-medium mb-2">Tier</label>
						<Select
							value={tier}
							onChange={setTier}
							options={tierOptions}
							placeholder="All Tiers"
						/>
					</div>

					{/* Sort */}
					<div>
						<label className="block text-sm font-medium mb-2">Sort By</label>
						<Select
							value={sort}
							onChange={setSort}
							options={sortOptions}
							placeholder="Sort By"
						/>
					</div>

					{/* Clear button */}
					{hasActiveFilters && (
						<Button
							variant="outline"
							size="sm"
							onClick={clearFilters}
							className="w-full"
						>
							<X className="h-4 w-4 mr-1" />
							Clear Filters
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
