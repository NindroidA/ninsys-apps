import { PageHeader } from "@/components/dashboard/PageHeader";
import { CreateMenuDialog, MenuCard, MenuEditor } from "@/components/reaction-roles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
	useDeleteReactionRoleMenu,
	useReactionRoleMenus,
	useRebuildMenu,
	useValidateMenu,
} from "@/hooks/useReactionRoles";
import { toast } from "@/stores/toastStore";
import { Button } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { Plus, Shield } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function ReactionRolesPage() {
	const { guildId } = useCurrentGuild();
	const { data: menus = [], isLoading } = useReactionRoleMenus(guildId);
	const deleteMenu = useDeleteReactionRoleMenu(guildId);
	const validateMenu = useValidateMenu(guildId);
	const rebuildMenu = useRebuildMenu(guildId);
	usePageTitle("Reaction Roles");

	const [searchParams, setSearchParams] = useSearchParams();
	const editingMenuId = searchParams.get("menu");

	const [isCreating, setIsCreating] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const [rebuildTarget, setRebuildTarget] = useState<string | null>(null);

	const navigateToEditor = useCallback(
		(menuId: string) => {
			setSearchParams({ menu: menuId }, { replace: true });
			setIsCreating(false);
		},
		[setSearchParams],
	);

	const navigateToList = useCallback(() => {
		setSearchParams({}, { replace: true });
	}, [setSearchParams]);

	const handleDelete = useCallback(() => {
		if (!deleteTarget) return;
		deleteMenu.mutate(deleteTarget, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, deleteMenu]);

	const handleRebuild = useCallback(() => {
		if (!rebuildTarget) return;
		rebuildMenu.mutate(rebuildTarget, {
			onSuccess: () => setRebuildTarget(null),
		});
	}, [rebuildTarget, rebuildMenu]);

	// Editor view
	if (editingMenuId) {
		return (
			<FadeIn className="max-w-4xl">
				<PageHeader
					title="Reaction Roles"
					description="Configure self-assignable roles via reactions"
				/>
				<MenuEditor guildId={guildId} menuId={editingMenuId} onBack={navigateToList} />
			</FadeIn>
		);
	}

	// List view
	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Reaction Roles"
				description="Configure self-assignable roles via reactions"
			/>

			<div className="space-y-4">
				{!isCreating && (
					<div className="flex justify-end">
						<Button variant="outline" onClick={() => setIsCreating(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Create Menu
						</Button>
					</div>
				)}

				{isCreating && (
					<CreateMenuDialog
						guildId={guildId}
						onCreated={navigateToEditor}
						onCancel={() => setIsCreating(false)}
					/>
				)}

				{isLoading ? (
					<div className="py-8 flex items-center justify-center">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				) : menus.length === 0 && !isCreating ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
						<p className="text-muted-foreground mb-1">No reaction role menus yet</p>
						<p className="text-sm text-muted-foreground">
							Create one to let members self-assign roles.
						</p>
					</div>
				) : (
					<StaggerContainer>
						<div className="space-y-3">
							{menus.map((menu) => (
								<MenuCard
									key={menu.id}
									menu={menu}
									onEdit={() => navigateToEditor(menu.id)}
									onValidate={() => {
										validateMenu.mutate(menu.id, {
											onSuccess: (data) => {
												if (data?.valid) {
													toast.success(`"${menu.name}" is valid`);
												} else if (data?.issues?.length) {
													toast.error(`${data.issues.length} issue(s) found in "${menu.name}"`);
												}
											},
										});
									}}
									onRebuild={() => setRebuildTarget(menu.id)}
									onDelete={() => setDeleteTarget(menu.id)}
								/>
							))}
						</div>
					</StaggerContainer>
				)}
			</div>

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Delete Menu"
				description="Delete this menu? The message in Discord will remain but reactions will stop working."
				confirmLabel="Delete"
				variant="destructive"
				onConfirm={handleDelete}
				isLoading={deleteMenu.isPending}
			/>

			<ConfirmDialog
				open={!!rebuildTarget}
				onOpenChange={(open) => {
					if (!open) setRebuildTarget(null);
				}}
				title="Rebuild Menu"
				description="This will re-post the reaction role message in the selected channel. Continue?"
				confirmLabel="Rebuild"
				onConfirm={handleRebuild}
				isLoading={rebuildMenu.isPending}
			/>
		</FadeIn>
	);
}
