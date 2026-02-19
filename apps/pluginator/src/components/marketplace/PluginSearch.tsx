/**
 * Plugin Search and Filters
 *
 * Search input and filter controls for the plugin browser
 */

import { Checkbox, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import { CATEGORY_INFO } from "@/types/registry";
import type { PluginCategory, RegistryFilters } from "@/types/registry";
import { Button, Input } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import {
	BookOpen,
	Coins,
	Filter,
	Gamepad2,
	Globe,
	Key,
	MessageCircle,
	Search,
	Settings,
	Shield,
	Sparkles,
	Target,
	Users,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Icon mapping for categories with colors
const CATEGORY_ICON_MAP: Record<PluginCategory, React.ReactNode> = {
	admin: <Settings className="h-4 w-4 text-slate-400" />,
	economy: <Coins className="h-4 w-4 text-amber-500" />,
	permissions: <Key className="h-4 w-4 text-yellow-500" />,
	world: <Globe className="h-4 w-4 text-emerald-500" />,
	gameplay: <Target className="h-4 w-4 text-rose-500" />,
	chat: <MessageCircle className="h-4 w-4 text-sky-400" />,
	protection: <Shield className="h-4 w-4 text-blue-500" />,
	utility: <Wrench className="h-4 w-4 text-orange-400" />,
	library: <BookOpen className="h-4 w-4 text-violet-400" />,
	performance: <Zap className="h-4 w-4 text-yellow-400" />,
	cosmetic: <Sparkles className="h-4 w-4 text-pink-400" />,
	minigames: <Gamepad2 className="h-4 w-4 text-green-400" />,
	social: <Users className="h-4 w-4 text-cyan-400" />,
};

interface PluginSearchProps {
	initialFilters?: RegistryFilters;
	mcVersions?: string[];
	onFiltersChange: (filters: RegistryFilters) => void;
	className?: string;
}

const SORT_OPTIONS: SelectOption[] = [
	{ value: "name", label: "Name A-Z" },
	{ value: "downloads", label: "Most Downloads" },
	{ value: "rating", label: "Highest Rated" },
	{ value: "updated", label: "Recently Updated" },
];

export function PluginSearch({
	initialFilters = {},
	mcVersions = [],
	onFiltersChange,
	className,
}: PluginSearchProps) {
	const [search, setSearch] = useState(initialFilters.search || "");
	const [category, setCategory] = useState<string>(initialFilters.category || "");
	const [mcVersion, setMcVersion] = useState(initialFilters.mcVersion || "");
	const [sort, setSort] = useState<string>(initialFilters.sort || "name");
	const [verified, setVerified] = useState(initialFilters.verified || false);
	const [showFilters, setShowFilters] = useState(false);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			onFiltersChange({
				search: search || undefined,
				category: (category as PluginCategory) || undefined,
				mcVersion: mcVersion || undefined,
				sort: sort as RegistryFilters["sort"],
				verified: verified || undefined,
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [search, category, mcVersion, sort, verified, onFiltersChange]);

	const hasActiveFilters = category || mcVersion || verified;

	const clearFilters = () => {
		setCategory("");
		setMcVersion("");
		setVerified(false);
	};

	const categoryOptions: SelectOption[] = useMemo(
		() => [
			{ value: "", label: "All Categories" },
			...Object.entries(CATEGORY_INFO).map(([id, info]) => ({
				value: id,
				label: info.name,
				icon: CATEGORY_ICON_MAP[id as PluginCategory],
			})),
		],
		[],
	);

	const versionOptions: SelectOption[] = useMemo(
		() => [
			{ value: "", label: "All Versions" },
			...mcVersions.map((v) => ({ value: v, label: v })),
		],
		[mcVersions],
	);

	const sortOptions: SelectOption[] = useMemo(
		() => [{ value: "", label: "Sort By" }, ...SORT_OPTIONS],
		[],
	);

	return (
		<div className={cn("space-y-4", className)}>
			{/* Search bar row */}
			<div className="flex flex-col lg:flex-row gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 via-muted/30 to-transparent border border-border/50">
				{/* Search input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search plugins..."
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
					{hasActiveFilters && <span className="ml-2 h-2 w-2 rounded-full bg-primary" />}
				</Button>

				{/* Desktop filters inline */}
				<div className="hidden lg:flex items-center gap-2">
					{/* Category */}
					<Select
						value={category}
						onChange={setCategory}
						options={categoryOptions}
						placeholder="All Categories"
						className="w-44"
					/>

					{/* MC Version */}
					<Select
						value={mcVersion}
						onChange={setMcVersion}
						options={versionOptions}
						placeholder="All Versions"
						className="w-36"
					/>

					{/* Sort */}
					<Select
						value={sort}
						onChange={setSort}
						options={sortOptions}
						placeholder="Sort By"
						className="w-40"
					/>

					{/* Verified toggle */}
					<Checkbox checked={verified} onChange={setVerified} label="Verified only" />

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

					{/* MC Version */}
					<div>
						<label className="block text-sm font-medium mb-2">Minecraft Version</label>
						<Select
							value={mcVersion}
							onChange={setMcVersion}
							options={versionOptions}
							placeholder="All Versions"
						/>
					</div>

					{/* Sort */}
					<div>
						<label className="block text-sm font-medium mb-2">Sort By</label>
						<Select value={sort} onChange={setSort} options={sortOptions} placeholder="Sort By" />
					</div>

					{/* Verified toggle */}
					<Checkbox checked={verified} onChange={setVerified} label="Verified plugins only" />

					{/* Clear button */}
					{hasActiveFilters && (
						<Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
							<X className="h-4 w-4 mr-1" />
							Clear Filters
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

/**
 * Simple search bar (for hero sections)
 */
export function SimpleSearch({
	onSearch,
	placeholder = "Search plugins...",
	className,
}: {
	onSearch: (query: string) => void;
	placeholder?: string;
	className?: string;
}) {
	const [value, setValue] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(value);
	};

	return (
		<form onSubmit={handleSubmit} className={cn("relative", className)}>
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
			<Input
				type="search"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="pl-12 h-12 text-base rounded-xl"
			/>
			<Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
				Search
			</Button>
		</form>
	);
}
