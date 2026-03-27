import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { ChevronLeft, ChevronRight, MoreVertical, Search } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "./LoadingSkeleton";

export interface Column<T> {
	key: string;
	header: string;
	render?: (row: T) => ReactNode;
	sortable?: boolean;
	width?: string;
	className?: string;
}

interface RowAction {
	label: string;
	icon?: ComponentType<{ className?: string }>;
	onClick: () => void;
	variant?: "default" | "destructive";
	disabled?: boolean;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	isLoading?: boolean;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	onPageChange?: (page: number) => void;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	emptyState?: {
		title: string;
		description?: string;
		icon?: ComponentType<{ className?: string }>;
	};
	rowActions?: (row: T) => RowAction[];
	getRowKey: (row: T) => string;
}

export function DataTable<T>({
	data,
	columns,
	isLoading,
	pagination,
	onPageChange,
	searchValue,
	onSearchChange,
	searchPlaceholder = "Search...",
	emptyState,
	rowActions,
	getRowKey,
}: DataTableProps<T>) {
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const menuRef = useRef<HTMLTableCellElement>(null);

	const closeMenu = useCallback(() => setOpenMenu(null), []);

	useEffect(() => {
		if (!openMenu) return;
		function onClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				closeMenu();
			}
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [openMenu, closeMenu]);

	return (
		<div>
			{/* Search bar */}
			{onSearchChange && (
				<div className="relative mb-4">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						type="text"
						value={searchValue ?? ""}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={searchPlaceholder}
						className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-primary/50"
					/>
				</div>
			)}

			{/* Table */}
			<div className="overflow-x-auto rounded-lg border border-border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/50">
							{columns.map((col) => (
								<th
									key={col.key}
									className={cn(
										"px-4 py-3 text-left font-medium text-muted-foreground",
										col.className,
									)}
									style={col.width ? { width: col.width } : undefined}
								>
									{col.header}
								</th>
							))}
							{rowActions && <th className="px-4 py-3 w-10" />}
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={`skeleton-${i}`} className="border-b border-border">
									{columns.map((col) => (
										<td key={col.key} className="px-4 py-3">
											<Skeleton className="h-4 w-full" />
										</td>
									))}
									{rowActions && (
										<td className="px-4 py-3">
											<Skeleton className="h-4 w-4" />
										</td>
									)}
								</tr>
							))
						) : data.length === 0 ? (
							<tr>
								<td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-12 text-center">
									{emptyState?.icon && (
										<emptyState.icon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
									)}
									<p className="font-medium">{emptyState?.title ?? "No data"}</p>
									{emptyState?.description && (
										<p className="text-sm text-muted-foreground mt-1">{emptyState.description}</p>
									)}
								</td>
							</tr>
						) : (
							data.map((row) => {
								const key = getRowKey(row);
								return (
									<tr
										key={key}
										className="border-b border-border hover:bg-muted/30 transition-colors"
									>
										{columns.map((col) => (
											<td key={col.key} className={cn("px-4 py-3", col.className)}>
												{col.render
													? col.render(row)
													: String((row as Record<string, unknown>)[col.key] ?? "")}
											</td>
										))}
										{rowActions && (
											<td
												className="px-4 py-3 relative"
												ref={openMenu === key ? menuRef : undefined}
											>
												<button
													type="button"
													onClick={() => setOpenMenu(openMenu === key ? null : key)}
													className="p-1 rounded hover:bg-muted transition-colors"
													aria-label="Row actions"
												>
													<MoreVertical className="h-4 w-4" />
												</button>
												{openMenu === key && (
													<div className="absolute right-4 top-full mt-1 w-40 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
														{rowActions(row).map((action) => {
															const Icon = action.icon;
															return (
																<button
																	key={action.label}
																	type="button"
																	disabled={action.disabled}
																	onClick={() => {
																		action.onClick();
																		closeMenu();
																	}}
																	className={cn(
																		"flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left",
																		action.variant === "destructive" && "text-destructive",
																		action.disabled && "opacity-50 cursor-not-allowed",
																	)}
																>
																	{Icon && <Icon className="h-4 w-4" />}
																	{action.label}
																</button>
															);
														})}
													</div>
												)}
											</td>
										)}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-between mt-4">
					<span className="text-sm text-muted-foreground">
						Showing {(pagination.page - 1) * pagination.limit + 1}–
						{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
					</span>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
							disabled={pagination.page <= 1}
							onClick={() => onPageChange?.(pagination.page - 1)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm px-2">
							{pagination.page} / {pagination.totalPages}
						</span>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
							disabled={pagination.page >= pagination.totalPages}
							onClick={() => onPageChange?.(pagination.page + 1)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
