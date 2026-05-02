import { useDeletePermission } from "@/hooks/usePermissions";
import {
	type Permission,
	type PermissionLevel,
	compareLevels,
	getFeatureLabel,
} from "@/types/permissions";
import { cn } from "@ninsys/ui/lib";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PermissionCellActions } from "./PermissionCellActions";

interface PermissionMobileListProps {
	guildId: string;
	permissions: Permission[];
	features: string[];
	levels: PermissionLevel[];
	onAddToFeature: (feature: string) => void;
}

/**
 * Mobile-friendly collapsible list: each feature is a section header with
 * grant count; expanding reveals the role+level rows. Orphan grants float
 * into their own section at the top so they're easy to clean up.
 */
export function PermissionMobileList({
	guildId,
	permissions,
	features,
	levels,
	onAddToFeature,
}: PermissionMobileListProps) {
	const deletePermission = useDeletePermission(guildId);
	const [openFeatures, setOpenFeatures] = useState<Record<string, boolean>>({});

	const { byFeature, orphans } = useMemo(() => {
		const map = new Map<string, Permission[]>();
		const orphanList: Permission[] = [];

		for (const p of permissions) {
			if (p.roleName === null) {
				orphanList.push(p);
				continue;
			}
			const list = map.get(p.feature) ?? [];
			list.push(p);
			map.set(p.feature, list);
		}

		for (const list of map.values()) {
			list.sort((a, b) => {
				const lvlCmp = compareLevels(b.level, a.level);
				if (lvlCmp !== 0) return lvlCmp;
				return (a.roleName ?? "").localeCompare(b.roleName ?? "");
			});
		}

		return { byFeature: map, orphans: orphanList };
	}, [permissions]);

	const toggleFeature = (feature: string) => {
		setOpenFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
	};

	return (
		<div className="space-y-2">
			{/* Orphan section surfaces first so it's impossible to miss */}
			{orphans.length > 0 && (
				<div className="rounded-lg border border-amber-500/40 bg-amber-500/5 overflow-hidden">
					<div className="px-4 py-3 flex items-center gap-2">
						<span className="font-medium text-amber-500 text-sm">Deleted roles</span>
						<span className="text-xs text-muted-foreground">· {orphans.length}</span>
					</div>
					<ul className="divide-y divide-border/50">
						{orphans.map((p) => (
							<li key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
								<div className="flex flex-col">
									<span className="font-medium">{getFeatureLabel(p.feature)}</span>
									<span className="text-xs text-muted-foreground italic">
										Deleted role · {p.level}
									</span>
								</div>
								<button
									type="button"
									onClick={() => deletePermission.mutate(p.id)}
									disabled={deletePermission.isPending}
									className="inline-flex items-center gap-1 text-xs text-red-500"
								>
									<Trash2 className="h-3 w-3" />
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{features.map((feature) => {
				const grants = byFeature.get(feature) ?? [];
				const isOpen = openFeatures[feature] ?? false;
				return (
					<div key={feature} className="rounded-lg border border-border overflow-hidden">
						<button
							type="button"
							onClick={() => toggleFeature(feature)}
							className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
							aria-expanded={isOpen}
						>
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">{getFeatureLabel(feature)}</span>
								<span className="text-xs text-muted-foreground">
									· {grants.length} grant{grants.length === 1 ? "" : "s"}
								</span>
							</div>
							<ChevronDown
								className={cn(
									"h-4 w-4 text-muted-foreground transition-transform",
									isOpen && "rotate-180",
								)}
							/>
						</button>
						{isOpen && (
							<div className="border-t border-border">
								{grants.length === 0 ? (
									<div className="px-4 py-6 text-center">
										<p className="text-xs text-muted-foreground mb-2">
											No grants. Admin-only access.
										</p>
										<button
											type="button"
											onClick={() => onAddToFeature(feature)}
											className="inline-flex items-center gap-1 text-xs text-primary"
										>
											<Plus className="h-3 w-3" />
											Add grant
										</button>
									</div>
								) : (
									<>
										<ul className="divide-y divide-border/50">
											{grants.map((grant) => (
												<li
													key={grant.id}
													className="flex items-center justify-between px-4 py-2.5 text-sm"
												>
													<span className="truncate pr-2">{grant.roleName}</span>
													<PermissionCellActions
														guildId={guildId}
														permission={grant}
														levels={levels}
													/>
												</li>
											))}
										</ul>
										<div className="border-t border-border/50 px-4 py-2">
											<button
												type="button"
												onClick={() => onAddToFeature(feature)}
												className="inline-flex items-center gap-1 text-xs text-primary"
											>
												<Plus className="h-3 w-3" />
												Add grant
											</button>
										</div>
									</>
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
