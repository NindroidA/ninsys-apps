import { useDeletePermission } from "@/hooks/usePermissions";
import type { Permission } from "@/types/permissions";
import { Button } from "@ninsys/ui/components";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

interface OrphanRolesBannerProps {
	guildId: string;
	orphans: Permission[];
}

/**
 * Shown when one or more permission rows reference roles that no longer
 * exist in the guild. Offers a one-click "clean up all" button that
 * deletes every orphan in sequence.
 */
export function OrphanRolesBanner({ guildId, orphans }: OrphanRolesBannerProps) {
	const deletePermission = useDeletePermission(guildId);
	const [isCleaning, setIsCleaning] = useState(false);

	const handleCleanup = useCallback(async () => {
		setIsCleaning(true);
		try {
			for (const orphan of orphans) {
				try {
					await deletePermission.mutateAsync(orphan.id);
				} catch {
					// Error toast already fired by the hook; continue with the rest
				}
			}
		} finally {
			setIsCleaning(false);
		}
	}, [orphans, deletePermission]);

	if (orphans.length === 0) return null;

	return (
		<div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
			<AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
			<div className="flex-1">
				<p className="text-sm font-medium text-amber-500">
					{orphans.length} permission{orphans.length === 1 ? "" : "s"} reference a deleted role
				</p>
				<p className="text-xs text-muted-foreground mt-1">
					These grants are harmless but clutter your matrix. Clean them up in one click.
				</p>
			</div>
			<Button size="sm" variant="outline" onClick={handleCleanup} disabled={isCleaning}>
				{isCleaning && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
				Clean up
			</Button>
		</div>
	);
}
