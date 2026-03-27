import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useUpdateBaitChannelConfig } from "@/hooks/useBaitChannel";
import { useConfig, useUpdateConfig } from "@/hooks/useConfig";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { useOverview } from "@/hooks/useOverview";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useUpdateRulesConfig } from "@/hooks/useRules";
import { deepEqual } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
	BookOpen,
	Brain,
	FileText,
	Megaphone,
	RotateCcw,
	ShieldAlert,
	Smile,
	Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ConfigFormState {
	enableGlobalStaffRole: boolean;
	globalStaffRole: string | null;
}

interface SystemInfo {
	name: string;
	path: string;
	icon: LucideIcon;
	key: string;
}

const SYSTEMS: SystemInfo[] = [
	{ name: "Tickets", path: "tickets", icon: Ticket, key: "tickets" },
	{
		name: "Applications",
		path: "applications",
		icon: FileText,
		key: "applications",
	},
	{
		name: "Announcements",
		path: "announcements",
		icon: Megaphone,
		key: "announcements",
	},
	{ name: "Memory", path: "memory", icon: Brain, key: "memory" },
	{ name: "Rules", path: "rules", icon: BookOpen, key: "rules" },
	{
		name: "Reaction Roles",
		path: "reaction-roles",
		icon: Smile,
		key: "reactionRoles",
	},
	{
		name: "Bait Channel",
		path: "bait-channel",
		icon: ShieldAlert,
		key: "baitChannel",
	},
];

function SkeletonConfig() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="rounded-xl border border-border bg-card overflow-visible">
				<div className="px-6 py-4 border-b border-border">
					<div className="h-5 w-40 rounded bg-muted" />
					<div className="h-4 w-64 rounded bg-muted mt-2" />
				</div>
				<div className="p-6 space-y-4">
					<div className="h-16 rounded-xl bg-muted" />
					<div className="h-10 rounded-lg bg-muted" />
				</div>
			</div>
		</div>
	);
}

export function ConfigPage() {
	const { guildId } = useCurrentGuild();
	const { data: config, isLoading } = useConfig(guildId);
	const { data: overview } = useOverview(guildId);
	const updateConfig = useUpdateConfig(guildId);
	const updateBaitConfig = useUpdateBaitChannelConfig(guildId);
	const updateRulesConfig = useUpdateRulesConfig(guildId);
	usePageTitle("Bot Configuration");

	const [showResetAll, setShowResetAll] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const handleResetAll = useCallback(async () => {
		setIsResetting(true);
		try {
			await Promise.allSettled([
				updateBaitConfig.mutateAsync({ banReason: null, warningMessage: null }),
				updateRulesConfig.mutateAsync({ customText: null }),
			]);
			toast.success("All custom messages reset to defaults");
		} catch {
			toast.error("Some resets may have failed");
		} finally {
			setIsResetting(false);
			setShowResetAll(false);
		}
	}, [updateBaitConfig, updateRulesConfig]);

	const [form, setForm] = useState<ConfigFormState>({
		enableGlobalStaffRole: false,
		globalStaffRole: null,
	});
	const [original, setOriginal] = useState<ConfigFormState>({
		enableGlobalStaffRole: false,
		globalStaffRole: null,
	});

	useEffect(() => {
		if (config) {
			const state: ConfigFormState = {
				enableGlobalStaffRole: config.enableGlobalStaffRole,
				globalStaffRole: config.globalStaffRole,
			};
			setForm(state);
			setOriginal(state);
		}
	}, [config]);

	const isDirty = !deepEqual(form, original);

	const handleSave = useCallback(() => {
		updateConfig.mutate(
			{
				enableGlobalStaffRole: form.enableGlobalStaffRole,
				globalStaffRole: form.enableGlobalStaffRole ? form.globalStaffRole : null,
			},
			{ onSuccess: () => setOriginal(form) },
		);
	}, [form, updateConfig]);

	const handleDiscard = useCallback(() => {
		setForm(original);
	}, [original]);

	if (isLoading) {
		return (
			<FadeIn>
				<PageHeader title="Bot Configuration" />
				<SkeletonConfig />
			</FadeIn>
		);
	}

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Bot Configuration"
				description="Global settings for Cogworks in this server"
			/>

			<div className="space-y-6">
				<ConfigSection
					title="Staff Role"
					description="Enable a global staff role that has access across all systems"
				>
					<StatusToggle
						enabled={form.enableGlobalStaffRole}
						onChange={(enabled) =>
							setForm((prev) => ({
								...prev,
								enableGlobalStaffRole: enabled,
								globalStaffRole: enabled ? prev.globalStaffRole : null,
							}))
						}
						label="Global Staff Role"
						description="When enabled, members with this role can access all bot systems"
						disabled={updateConfig.isPending}
					/>

					{form.enableGlobalStaffRole && (
						<RolePicker
							guildId={guildId}
							value={form.globalStaffRole}
							onChange={(roleId) =>
								setForm((prev) => ({
									...prev,
									globalStaffRole: roleId as string | null,
								}))
							}
							label="Staff Role"
							placeholder="Select a staff role"
							clearable
							disabled={updateConfig.isPending}
						/>
					)}
				</ConfigSection>

				{/* Systems Overview */}
				<ConfigSection
					title="Systems Overview"
					description="Status of all bot systems in this server"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 -mx-2">
						{SYSTEMS.map((system) => {
							const configured =
								(overview?.systems as Record<string, { configured?: boolean }> | undefined)?.[
									system.key
								]?.configured ?? false;
							const Icon = system.icon;

							return (
								<Link
									key={system.path}
									to={`/dashboard/${guildId}/${system.path}`}
									className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Icon className="h-5 w-5 text-muted-foreground" />
										<span className="text-sm font-medium">{system.name}</span>
									</div>
									{configured ? (
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
											Configured
										</span>
									) : (
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
											Not Configured
										</span>
									)}
								</Link>
							);
						})}
					</div>
				</ConfigSection>

				{/* Reset All Custom Messages */}
				<ConfigSection
					title="Reset Custom Messages"
					description="Reset all custom messages across all systems back to their defaults"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">
								This will reset custom ban reasons, warning messages, and rules text back to the
								bot's built-in defaults.
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => setShowResetAll(true)}
							className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
						>
							<RotateCcw className="h-4 w-4 mr-2" />
							Reset All
						</Button>
					</div>
				</ConfigSection>
			</div>

			<ConfirmDialog
				open={showResetAll}
				onOpenChange={setShowResetAll}
				title="Reset All Custom Messages"
				description="This will reset all custom messages across Bait Channel (ban reason, warning message) and Rules (custom text) back to the bot's built-in defaults. This cannot be undone."
				confirmLabel="Reset All"
				variant="destructive"
				onConfirm={handleResetAll}
				isLoading={isResetting}
			/>

			<SaveBar
				isDirty={isDirty}
				isLoading={updateConfig.isPending}
				onSave={handleSave}
				onDiscard={handleDiscard}
			/>
		</FadeIn>
	);
}
