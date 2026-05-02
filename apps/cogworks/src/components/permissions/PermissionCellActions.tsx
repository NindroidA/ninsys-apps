import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDeletePermission, useUpsertPermission } from "@/hooks/usePermissions";
import {
	PERMISSION_LEVEL_DESCRIPTIONS,
	PERMISSION_LEVEL_LABELS,
	type Permission,
	type PermissionLevel,
} from "@/types/permissions";
import { cn } from "@ninsys/ui/lib";
import { Check, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { PermissionLevelBadge } from "./PermissionLevelBadge";

interface PermissionCellActionsProps {
	guildId: string;
	permission: Permission;
	levels: PermissionLevel[];
}

/**
 * A permission cell showing the current level as a badge. Click to open
 * a popover that lets you change the level or delete the grant.
 */
export function PermissionCellActions({ guildId, permission, levels }: PermissionCellActionsProps) {
	const { user } = useAuth();
	const upsert = useUpsertPermission(guildId);
	const deletePermission = useDeletePermission(guildId);
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => setIsOpen(false), []);
	useClickOutside(containerRef, handleClose, isOpen);

	const handleChangeLevel = useCallback(
		(newLevel: PermissionLevel) => {
			if (newLevel === permission.level) {
				setIsOpen(false);
				return;
			}
			upsert.mutate(
				{
					feature: permission.feature,
					roleId: permission.roleId,
					level: newLevel,
					triggeredBy: user?.id,
				},
				{
					onSuccess: () => setIsOpen(false),
				},
			);
		},
		[upsert, permission, user?.id],
	);

	const handleDelete = useCallback(() => {
		deletePermission.mutate(permission.id, {
			onSuccess: () => setIsOpen(false),
		});
	}, [deletePermission, permission.id]);

	const isPending = upsert.isPending || deletePermission.isPending;

	return (
		<div ref={containerRef} className="relative inline-block">
			<button
				type="button"
				onClick={() => setIsOpen((v) => !v)}
				className="rounded-full hover:ring-2 hover:ring-primary/30 transition-all"
				aria-label={`Change ${permission.level} permission for ${permission.roleName ?? "role"}`}
			>
				<PermissionLevelBadge level={permission.level} />
			</button>

			{isOpen && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-40 overflow-hidden">
					<div className="px-3 py-2 border-b border-border">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
							Change level
						</p>
					</div>
					<div className="py-1">
						{levels.map((l) => {
							const isCurrent = l === permission.level;
							return (
								<button
									key={l}
									type="button"
									onClick={() => handleChangeLevel(l)}
									disabled={isPending}
									className={cn(
										"flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left",
										isCurrent && "bg-primary/5",
									)}
								>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{PERMISSION_LEVEL_LABELS[l]}</span>
											{isCurrent && <Check className="h-3.5 w-3.5 text-primary" />}
										</div>
										<p className="text-xs text-muted-foreground">
											{PERMISSION_LEVEL_DESCRIPTIONS[l]}
										</p>
									</div>
								</button>
							);
						})}
					</div>
					<div className="border-t border-border py-1">
						<button
							type="button"
							onClick={handleDelete}
							disabled={isPending}
							className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
						>
							<Trash2 className="h-3.5 w-3.5" />
							Remove permission
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
