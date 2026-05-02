import { useDeletePermission } from "@/hooks/usePermissions";
import {
	type Permission,
	type PermissionLevel,
	compareLevels,
	getFeatureLabel,
} from "@/types/permissions";
import { Trash2, Users } from "lucide-react";
import { useMemo } from "react";
import { PermissionCellActions } from "./PermissionCellActions";

interface PermissionByRoleViewProps {
	guildId: string;
	permissions: Permission[];
	levels: PermissionLevel[];
}

interface RoleGroup {
	roleId: string;
	roleName: string | null;
	grants: Permission[];
}

/**
 * Desktop alternative layout: grouped by role. Good for answering
 * "what can Moderator do?" — a role-centric view of the same data.
 *
 * Orphan rows get their own "Deleted roles" group at the bottom.
 */
export function PermissionByRoleView({ guildId, permissions, levels }: PermissionByRoleViewProps) {
	const deletePermission = useDeletePermission(guildId);

	const { roleGroups, orphanGroup } = useMemo(() => {
		const byRole = new Map<string, RoleGroup>();
		const orphanGrants: Permission[] = [];

		for (const p of permissions) {
			if (p.roleName === null) {
				orphanGrants.push(p);
				continue;
			}
			let group = byRole.get(p.roleId);
			if (!group) {
				group = { roleId: p.roleId, roleName: p.roleName, grants: [] };
				byRole.set(p.roleId, group);
			}
			group.grants.push(p);
		}

		// Sort each group's grants by level DESC then feature name ASC
		for (const g of byRole.values()) {
			g.grants.sort((a, b) => {
				const lvlCmp = compareLevels(b.level, a.level);
				if (lvlCmp !== 0) return lvlCmp;
				return a.feature.localeCompare(b.feature);
			});
		}

		const groups = Array.from(byRole.values());
		groups.sort((a, b) => (a.roleName ?? "").localeCompare(b.roleName ?? ""));

		return {
			roleGroups: groups,
			orphanGroup: orphanGrants,
		};
	}, [permissions]);

	if (roleGroups.length === 0 && orphanGroup.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border py-12 text-center">
				<Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
				<p className="text-sm text-muted-foreground">
					No roles have grants yet. Add one to see it here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{roleGroups.map((group) => (
				<div key={group.roleId} className="rounded-lg border border-border overflow-hidden">
					<div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">{group.roleName}</span>
							<span className="text-xs text-muted-foreground">
								· {group.grants.length} grant{group.grants.length === 1 ? "" : "s"}
							</span>
						</div>
					</div>
					<ul className="divide-y divide-border/50">
						{group.grants.map((grant) => (
							<li key={grant.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
								<span className="font-medium">{getFeatureLabel(grant.feature)}</span>
								<PermissionCellActions guildId={guildId} permission={grant} levels={levels} />
							</li>
						))}
					</ul>
				</div>
			))}

			{/* Orphan group */}
			{orphanGroup.length > 0 && (
				<div className="rounded-lg border border-amber-500/40 bg-amber-500/5 overflow-hidden">
					<div className="px-4 py-3 border-b border-amber-500/30 flex items-center gap-2">
						<span className="font-medium text-amber-500">Deleted roles</span>
						<span className="text-xs text-muted-foreground">
							· {orphanGroup.length} orphan grant{orphanGroup.length === 1 ? "" : "s"}
						</span>
					</div>
					<ul className="divide-y divide-border/50">
						{orphanGroup.map((grant) => (
							<li key={grant.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
								<div className="flex items-center gap-3">
									<span className="text-muted-foreground">{getFeatureLabel(grant.feature)}</span>
									<span className="capitalize text-xs text-muted-foreground">{grant.level}</span>
								</div>
								<button
									type="button"
									onClick={() => deletePermission.mutate(grant.id)}
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
