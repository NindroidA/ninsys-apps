import { useDeletePermission } from "@/hooks/usePermissions";
import { type Permission, type PermissionLevel, getFeatureLabel } from "@/types/permissions";
import { cn } from "@ninsys/ui/lib";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { PermissionCellActions } from "./PermissionCellActions";

interface PermissionMatrixProps {
	guildId: string;
	permissions: Permission[];
	features: string[];
	levels: PermissionLevel[];
	/** Open the add dialog pre-filled for this feature. */
	onAddToFeature: (feature: string, roleId?: string) => void;
}

/**
 * Desktop matrix view: rows = features, columns = roles that have any grant.
 * Cells either show the level badge (click → popover) or are empty with a
 * small "+" to add a grant for that role+feature combination.
 *
 * Orphan rows (roleName=null) render a single-column strip inline so admins
 * can clean them up in place without leaving the matrix.
 */
export function PermissionMatrix({
	guildId,
	permissions,
	features,
	levels,
	onAddToFeature,
}: PermissionMatrixProps) {
	const deletePermission = useDeletePermission(guildId);

	const { activeRoles, orphanPerms, cellMap } = useMemo(() => {
		// Split orphans off — they get their own row strip below the matrix.
		const orphans: Permission[] = [];
		const valid: Permission[] = [];
		for (const p of permissions) {
			if (p.roleName === null) orphans.push(p);
			else valid.push(p);
		}

		// Collect unique roles (id+name) from valid grants.
		const roleMap = new Map<string, string>();
		for (const p of valid) {
			if (p.roleName && !roleMap.has(p.roleId)) {
				roleMap.set(p.roleId, p.roleName);
			}
		}
		const roleList = Array.from(roleMap.entries()).map(([id, name]) => ({ id, name }));
		roleList.sort((a, b) => a.name.localeCompare(b.name));

		// Build (feature, roleId) → Permission lookup for fast cell rendering.
		const map = new Map<string, Permission>();
		for (const p of valid) {
			map.set(`${p.feature}:${p.roleId}`, p);
		}

		return { activeRoles: roleList, orphanPerms: orphans, cellMap: map };
	}, [permissions]);

	const hasAnyRole = activeRoles.length > 0;

	return (
		<div className="rounded-lg border border-border overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-muted/30">
						<tr>
							<th className="sticky left-0 bg-muted/30 text-left py-3 px-4 font-medium text-muted-foreground w-48 min-w-[12rem]">
								Feature
							</th>
							{activeRoles.map((role) => (
								<th
									key={role.id}
									className="text-center py-3 px-3 font-medium text-xs min-w-[10rem]"
								>
									<span className="truncate block" title={role.name}>
										{role.name}
									</span>
								</th>
							))}
							{!hasAnyRole && (
								<th className="text-center py-3 px-3 text-xs text-muted-foreground font-normal italic">
									No grants yet — add one to populate the matrix
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{features.map((feature, fIndex) => (
							<tr
								key={feature}
								className={cn(
									"border-t border-border/50",
									fIndex % 2 === 0 ? "bg-transparent" : "bg-muted/10",
								)}
							>
								<td className="sticky left-0 bg-inherit py-2 px-4 font-medium">
									<div className="flex items-center justify-between gap-2">
										<span>{getFeatureLabel(feature)}</span>
										<button
											type="button"
											onClick={() => onAddToFeature(feature)}
											className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
											title="Add grant for this feature"
											aria-label={`Add grant for ${getFeatureLabel(feature)}`}
										>
											<Plus className="h-3.5 w-3.5" />
										</button>
									</div>
								</td>
								{activeRoles.map((role) => {
									const perm = cellMap.get(`${feature}:${role.id}`);
									return (
										<td key={role.id} className="text-center py-2 px-3">
											{perm ? (
												<PermissionCellActions
													guildId={guildId}
													permission={perm}
													levels={levels}
												/>
											) : (
												<button
													type="button"
													onClick={() => onAddToFeature(feature, role.id)}
													className="inline-flex items-center justify-center h-6 w-6 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-colors"
													aria-label={`Grant ${role.name} access to ${getFeatureLabel(feature)}`}
												>
													<Plus className="h-3.5 w-3.5" />
												</button>
											)}
										</td>
									);
								})}
								{!hasAnyRole && (
									<td className="text-center py-2 px-3">
										<button
											type="button"
											onClick={() => onAddToFeature(feature)}
											className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
										>
											<Plus className="h-3 w-3" />
											Add grant
										</button>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Orphan row strip — deleted roles that still have grants */}
			{orphanPerms.length > 0 && (
				<div className="border-t border-border bg-amber-500/5">
					<div className="px-4 py-2 text-xs font-medium text-amber-500 uppercase tracking-wider">
						Deleted roles
					</div>
					<ul className="divide-y divide-border/50">
						{orphanPerms.map((p) => (
							<li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
								<div className="flex items-center gap-3">
									<span className="text-muted-foreground">{getFeatureLabel(p.feature)}</span>
									<span className="text-muted-foreground/60">·</span>
									<span className="italic text-muted-foreground/80">Deleted role</span>
									<span className="text-muted-foreground/60">·</span>
									<span className="capitalize text-xs text-muted-foreground">{p.level}</span>
								</div>
								<button
									type="button"
									onClick={() => deletePermission.mutate(p.id)}
									disabled={deletePermission.isPending}
									className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
								>
									<Trash2 className="h-3 w-3" />
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
