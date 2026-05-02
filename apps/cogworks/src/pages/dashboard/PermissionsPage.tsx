import { PageHeader } from "@/components/dashboard/PageHeader";
import { AddPermissionDialog } from "@/components/permissions/AddPermissionDialog";
import { OrphanRolesBanner } from "@/components/permissions/OrphanRolesBanner";
import { PermissionByRoleView } from "@/components/permissions/PermissionByRoleView";
import { PermissionMatrix } from "@/components/permissions/PermissionMatrix";
import { PermissionMobileList } from "@/components/permissions/PermissionMobileList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDeletePermission, usePermissions } from "@/hooks/usePermissions";
import { toast } from "@/stores/toastStore";
import { type Permission, type PermissionLevel, getFeatureLabel } from "@/types/permissions";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Grid3x3, HelpCircle, Info, Lock, Plus, Search, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type DesktopView = "matrix" | "byRole";

interface AddDialogState {
	open: boolean;
	initialFeature?: string;
	initialRoleId?: string;
	initialLevel?: PermissionLevel;
	lockRole?: boolean;
	lockFeature?: boolean;
}

export function PermissionsPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Permissions");

	const { data, isLoading } = usePermissions(guildId);
	const deletePermission = useDeletePermission(guildId);

	const [view, setView] = useState<DesktopView>("matrix");
	const [filter, setFilter] = useState("");
	const [addDialog, setAddDialog] = useState<AddDialogState>({ open: false });
	const [showHelp, setShowHelp] = useState(false);
	const [showResetConfirm, setShowResetConfirm] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const permissions = data?.permissions ?? [];
	const features = data?.features ?? [];
	const levels = data?.levels ?? [];

	// Apply filter across both feature labels and role names.
	const filtered = useMemo(() => {
		if (!filter.trim()) return permissions;
		const q = filter.trim().toLowerCase();
		return permissions.filter((p) => {
			const featureLabel = getFeatureLabel(p.feature).toLowerCase();
			const roleName = (p.roleName ?? "deleted role").toLowerCase();
			return (
				featureLabel.includes(q) || p.feature.toLowerCase().includes(q) || roleName.includes(q)
			);
		});
	}, [permissions, filter]);

	const orphans = useMemo<Permission[]>(
		() => permissions.filter((p) => p.roleName === null),
		[permissions],
	);

	const handleAddNew = useCallback(() => {
		setAddDialog({ open: true });
	}, []);

	const handleAddToFeature = useCallback((feature: string, roleId?: string) => {
		setAddDialog({
			open: true,
			initialFeature: feature,
			initialRoleId: roleId,
			lockFeature: true,
		});
	}, []);

	const handleCloseDialog = useCallback(() => {
		setAddDialog({ open: false });
	}, []);

	const handleResetConfirm = useCallback(async () => {
		setIsResetting(true);
		try {
			for (const p of permissions) {
				try {
					await deletePermission.mutateAsync(p.id);
				} catch {
					// toast fired by hook; continue
				}
			}
			setShowResetConfirm(false);
			toast.success("Reset to defaults");
		} finally {
			setIsResetting(false);
		}
	}, [permissions, deletePermission]);

	const isEmpty = !isLoading && permissions.length === 0;

	return (
		<FadeIn>
			<PageHeader
				title="Permissions"
				description="Grant roles access to individual bot features"
				action={
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={() => setShowHelp((v) => !v)}>
							<HelpCircle className="h-4 w-4 mr-1.5" />
							How it works
						</Button>
						<Button size="sm" onClick={handleAddNew} disabled={isLoading}>
							<Plus className="h-4 w-4 mr-1.5" />
							Add Permission
						</Button>
					</div>
				}
			/>

			{/* Help panel */}
			{showHelp && (
				<div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm">
					<div className="flex items-start gap-2 mb-3">
						<Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
						<p className="font-medium">How advanced permissions work</p>
					</div>
					<ul className="space-y-1.5 text-muted-foreground pl-6 list-disc">
						<li>
							<span className="text-foreground font-medium">
								Discord Administrator always wins.
							</span>{" "}
							Adding grants never removes access from Discord admins.
						</li>
						<li>
							<span className="text-foreground font-medium">Levels are cumulative.</span>{" "}
							<code className="text-xs">admin</code> includes{" "}
							<code className="text-xs">manage</code> and <code className="text-xs">use</code>;{" "}
							<code className="text-xs">manage</code> includes <code className="text-xs">use</code>.
							The bot picks the highest level across a member's roles.
						</li>
						<li>
							<span className="text-foreground font-medium">
								No grant = no access (beyond admin).
							</span>{" "}
							Once you add a grant for a feature, non-admin users need an explicit grant to use it.
							Until then, the feature stays admin-only.
						</li>
						<li>
							<span className="text-foreground font-medium">Feature scope.</span> A grant applies to
							one feature only. To give a role access to multiple features, add multiple rows.
						</li>
					</ul>
				</div>
			)}

			{isLoading && (
				<div className="text-sm text-muted-foreground py-12 text-center">Loading permissions…</div>
			)}

			{!isLoading && isEmpty && <EmptyStateBanner onAddClick={handleAddNew} />}

			{!isLoading && !isEmpty && (
				<div className="space-y-4">
					{orphans.length > 0 && <OrphanRolesBanner guildId={guildId} orphans={orphans} />}

					{/* Controls row: filter + view toggle + reset */}
					<div className="flex items-center gap-3 flex-wrap">
						<div className="relative flex-1 min-w-[16rem]">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								placeholder="Filter by feature or role…"
								className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-primary/50"
							/>
						</div>

						{/* View toggle — desktop only */}
						<div className="hidden lg:inline-flex items-center rounded-lg bg-muted/50 border border-border p-0.5">
							<ViewToggle
								active={view === "matrix"}
								onClick={() => setView("matrix")}
								icon={Grid3x3}
								label="Matrix"
							/>
							<ViewToggle
								active={view === "byRole"}
								onClick={() => setView("byRole")}
								icon={Users}
								label="By Role"
							/>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowResetConfirm(true)}
							className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
						>
							Reset to defaults
						</Button>
					</div>

					{/* Desktop: matrix or by-role */}
					<div className="hidden lg:block">
						{view === "matrix" ? (
							<PermissionMatrix
								guildId={guildId}
								permissions={filtered}
								features={features}
								levels={levels}
								onAddToFeature={handleAddToFeature}
							/>
						) : (
							<PermissionByRoleView guildId={guildId} permissions={filtered} levels={levels} />
						)}
					</div>

					{/* Mobile: always collapsible list */}
					<div className="lg:hidden">
						<PermissionMobileList
							guildId={guildId}
							permissions={filtered}
							features={features}
							levels={levels}
							onAddToFeature={handleAddToFeature}
						/>
					</div>
				</div>
			)}

			<AddPermissionDialog
				open={addDialog.open}
				onOpenChange={(open) => (open ? undefined : handleCloseDialog())}
				guildId={guildId}
				features={features}
				levels={levels}
				initialFeature={addDialog.initialFeature}
				initialRoleId={addDialog.initialRoleId}
				initialLevel={addDialog.initialLevel}
				lockFeature={addDialog.lockFeature}
				lockRole={addDialog.lockRole}
			/>

			<ConfirmDialog
				open={showResetConfirm}
				onOpenChange={(open) => {
					if (!open) setShowResetConfirm(false);
				}}
				title="Reset all permissions?"
				description={`This will remove all ${permissions.length} permission grant${permissions.length === 1 ? "" : "s"} and revert every feature to admin-only access. This cannot be undone.`}
				confirmLabel="Reset"
				variant="destructive"
				isLoading={isResetting}
				onConfirm={handleResetConfirm}
			/>
		</FadeIn>
	);
}

// --- Subcomponents ---

function EmptyStateBanner({ onAddClick }: { onAddClick: () => void }) {
	return (
		<div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
			<Lock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
			<h3 className="text-lg font-semibold mb-2">Using default permissions</h3>
			<p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
				All features are currently locked to Discord administrators. Add a permission to let
				specific roles use, manage, or admin individual features.
			</p>
			<p className="text-xs text-muted-foreground/80 max-w-md mx-auto mb-6">
				Adding any grant opts in to the new permission system for that one feature only. Every other
				feature still falls back to admin-only until you explicitly configure it.
			</p>
			<Button onClick={onAddClick}>
				<Plus className="h-4 w-4 mr-1.5" />
				Add your first permission
			</Button>
		</div>
	);
}

interface ViewToggleProps {
	active: boolean;
	onClick: () => void;
	icon: typeof Grid3x3;
	label: string;
}

function ViewToggle({ active, onClick, icon: Icon, label }: ViewToggleProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={cn(
				"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
				active
					? "bg-background text-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground",
			)}
		>
			<Icon className="h-3.5 w-3.5" />
			{label}
		</button>
	);
}
