import { RolePicker } from "@/components/discord/RolePicker";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useDiscord";
import { useUpsertPermission } from "@/hooks/usePermissions";
import {
	PERMISSION_LEVEL_DESCRIPTIONS,
	PERMISSION_LEVEL_LABELS,
	type PermissionLevel,
	getFeatureLabel,
} from "@/types/permissions";
import { Button } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface AddPermissionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	guildId: string;
	features: string[];
	levels: PermissionLevel[];
	/** If provided, dialog opens pre-filled (edit mode). */
	initialFeature?: string;
	initialRoleId?: string;
	initialLevel?: PermissionLevel;
	/** If true, lock the role field (used when editing an existing grant). */
	lockRole?: boolean;
	/** If true, lock the feature field (used when adding into a feature row). */
	lockFeature?: boolean;
}

export function AddPermissionDialog({
	open,
	onOpenChange,
	guildId,
	features,
	levels,
	initialFeature,
	initialRoleId,
	initialLevel,
	lockRole,
	lockFeature,
}: AddPermissionDialogProps) {
	const { user } = useAuth();
	const { data: roles = [] } = useRoles(guildId);
	const upsert = useUpsertPermission(guildId);

	const [feature, setFeature] = useState<string>("");
	const [roleId, setRoleId] = useState<string | null>(null);
	const [level, setLevel] = useState<PermissionLevel>("use");

	const dialogRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	// Reset form when dialog opens
	useEffect(() => {
		if (!open) return;
		setFeature(initialFeature ?? features[0] ?? "");
		setRoleId(initialRoleId ?? null);
		setLevel(initialLevel ?? levels[0] ?? "use");
	}, [open, initialFeature, initialRoleId, initialLevel, features, levels]);

	// Focus trap + escape + body scroll lock
	useEffect(() => {
		if (!open) return;

		previousActiveElement.current = document.activeElement as HTMLElement | null;
		requestAnimationFrame(() => dialogRef.current?.focus());

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !upsert.isPending) {
				e.stopImmediatePropagation();
				onOpenChange(false);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
			previousActiveElement.current?.focus();
		};
	}, [open, upsert.isPending, onOpenChange]);

	const handleClose = useCallback(() => {
		if (!upsert.isPending) onOpenChange(false);
	}, [upsert.isPending, onOpenChange]);

	const handleSubmit = useCallback(async () => {
		if (!feature || !roleId) return;
		try {
			await upsert.mutateAsync({
				feature,
				roleId,
				level,
				triggeredBy: user?.id,
			});
			onOpenChange(false);
		} catch {
			// toast fired by hook, keep dialog open so user can retry
		}
	}, [feature, roleId, level, user?.id, upsert, onOpenChange]);

	const featureOptions = features.map((f) => ({ value: f, label: getFeatureLabel(f) }));
	const levelOptions = levels.map((l) => ({
		value: l,
		label: `${PERMISSION_LEVEL_LABELS[l]} — ${PERMISSION_LEVEL_DESCRIPTIONS[l]}`,
	}));

	// If lockRole and the role is deleted, surface a hint
	const lockedRoleName =
		lockRole && roleId ? (roles.find((r) => r.id === roleId)?.name ?? null) : null;

	const submitDisabled = !feature || !roleId || upsert.isPending;
	const isEditMode = !!(initialFeature && initialRoleId);

	const dialog = (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						className="fixed inset-0 bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
					/>
					<motion.div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="perm-dialog-title"
						tabIndex={-1}
						className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl outline-none"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
					>
						<h2 id="perm-dialog-title" className="text-lg font-semibold">
							{isEditMode ? "Change Permission" : "Add Permission"}
						</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Grant a role access to a specific feature.
						</p>

						<div className="mt-5 space-y-4">
							<Select
								label="Feature"
								value={feature}
								onChange={setFeature}
								options={featureOptions}
								disabled={lockFeature}
							/>

							{lockRole ? (
								<div>
									<label className="text-sm font-medium mb-1.5 block" htmlFor="locked-role">
										Role
									</label>
									<div
										id="locked-role"
										className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
									>
										{lockedRoleName ?? "Deleted role"}
									</div>
								</div>
							) : (
								<RolePicker
									guildId={guildId}
									value={roleId}
									onChange={(val) => setRoleId(typeof val === "string" ? val : null)}
									label="Role"
									placeholder="Select a role"
								/>
							)}

							<Select
								label="Level"
								value={level}
								onChange={(v) => setLevel(v as PermissionLevel)}
								options={levelOptions}
							/>
						</div>

						<div className="flex justify-end gap-2 mt-6">
							<Button variant="ghost" onClick={handleClose} disabled={upsert.isPending}>
								Cancel
							</Button>
							<Button onClick={handleSubmit} disabled={submitDisabled}>
								{upsert.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								{isEditMode ? "Save" : "Add"}
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);

	return createPortal(dialog, document.body);
}
