import { PageHeader } from "@/components/dashboard/PageHeader";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { isSystemEnabled, useSetupState, useToggleSystem } from "@/hooks/useSetup";
import type { SystemId, SystemState } from "@/types/setup";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import {
	BookOpen,
	Brain,
	CheckCircle2,
	Circle,
	FileText,
	Loader2,
	Megaphone,
	Shield,
	ShieldAlert,
	Smile,
	Ticket,
} from "lucide-react";
import type { ComponentType } from "react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface SystemInfo {
	id: SystemId;
	label: string;
	description: string;
	icon: ComponentType<{ className?: string }>;
	path: string;
}

const SYSTEMS: SystemInfo[] = [
	{
		id: "staffRole",
		label: "Staff Roles",
		description: "Configure staff and admin role permissions",
		icon: Shield,
		path: "roles",
	},
	{
		id: "ticket",
		label: "Ticket System",
		description: "Support tickets with types, workflow, SLA, and routing",
		icon: Ticket,
		path: "tickets",
	},
	{
		id: "application",
		label: "Application System",
		description: "Staff applications with positions and custom fields",
		icon: FileText,
		path: "applications",
	},
	{
		id: "announcement",
		label: "Announcements",
		description: "Formatted announcements with templates and scheduling",
		icon: Megaphone,
		path: "announcements",
	},
	{
		id: "baitchannel",
		label: "Bait Channel",
		description: "Honeypot detection with scoring and escalation",
		icon: ShieldAlert,
		path: "bait-channel",
	},
	{
		id: "memory",
		label: "Memory System",
		description: "Forum-based knowledge base with tags",
		icon: Brain,
		path: "memory",
	},
	{
		id: "rules",
		label: "Rules & Verification",
		description: "Server rules with reaction acknowledgment",
		icon: BookOpen,
		path: "rules",
	},
	{
		id: "reactionRole",
		label: "Reaction Roles",
		description: "Self-assignable roles via reaction menus",
		icon: Smile,
		path: "reaction-roles",
	},
];

function stateLabel(state: SystemState): string {
	switch (state) {
		case "complete":
			return "Configured";
		case "partial":
			return "In Progress";
		case "not_started":
			return "Not Configured";
	}
}

function stateColor(state: SystemState): string {
	switch (state) {
		case "complete":
			return "text-green-500";
		case "partial":
			return "text-yellow-500";
		case "not_started":
			return "text-muted-foreground";
	}
}

function stateDotColor(state: SystemState): string {
	switch (state) {
		case "complete":
			return "bg-green-500";
		case "partial":
			return "bg-yellow-500";
		case "not_started":
			return "bg-muted-foreground/50";
	}
}

function SystemCard({
	system,
	enabled,
	state,
	onToggle,
	isPending,
	guildId,
}: {
	system: SystemInfo;
	enabled: boolean;
	state: SystemState;
	onToggle: () => void;
	isPending: boolean;
	guildId: string;
}) {
	const Icon = system.icon;

	return (
		<Card className={cn("p-4 transition-all", !enabled && "opacity-60")}>
			<div className="flex items-start gap-4">
				{/* Icon */}
				<div
					className={cn(
						"rounded-lg p-2.5 flex-shrink-0",
						enabled ? "bg-primary/10" : "bg-muted",
					)}
				>
					<Icon className={cn("h-5 w-5", enabled ? "text-primary" : "text-muted-foreground")} />
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<Link
							to={`/dashboard/${guildId}/${system.path}`}
							className="text-sm font-semibold hover:text-primary transition-colors"
						>
							{system.label}
						</Link>
						{/* Status dot */}
						<div className="flex items-center gap-1.5">
							<span className={cn("h-1.5 w-1.5 rounded-full", stateDotColor(state))} />
							<span className={cn("text-[11px]", stateColor(state))}>
								{stateLabel(state)}
							</span>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">{system.description}</p>
				</div>

				{/* Toggle */}
				<button
					type="button"
					role="switch"
					aria-checked={enabled}
					aria-label={`${enabled ? "Disable" : "Enable"} ${system.label}`}
					disabled={isPending}
					onClick={onToggle}
					className={cn(
						"relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0",
						enabled
							? "bg-gradient-to-r from-primary to-accent shadow-[0_0_6px_oklch(0.68_0.16_245_/_0.25)]"
							: "bg-muted-foreground/30",
						isPending && "opacity-50 cursor-wait",
					)}
				>
					{isPending ? (
						<Loader2 className="h-3 w-3 animate-spin text-white absolute left-1/2 -translate-x-1/2" />
					) : (
						<span
							className={cn(
								"inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
								enabled ? "translate-x-6" : "translate-x-1",
							)}
						/>
					)}
				</button>
			</div>
		</Card>
	);
}

function SkeletonSystems() {
	return (
		<div className="space-y-3 animate-pulse">
			{[0, 1, 2, 3, 4].map((i) => (
				<div key={`skel-sys-${i}`} className="h-20 rounded-xl bg-muted" />
			))}
		</div>
	);
}

export function SystemSettingsPage() {
	const { guildId } = useCurrentGuild();
	const { data: setupState, isLoading } = useSetupState(guildId);
	const toggleSystem = useToggleSystem(guildId);
	usePageTitle("System Settings");

	const handleToggle = useCallback(
		(systemId: SystemId, currentlyEnabled: boolean) => {
			toggleSystem.mutate({ systemId, enabled: !currentlyEnabled });
		},
		[toggleSystem],
	);

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="System Settings"
				description="Enable or disable bot systems for this server"
			/>

			<div className="space-y-3">
				{isLoading ? (
					<SkeletonSystems />
				) : !setupState ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<p className="text-muted-foreground">
							System settings are not available yet.
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Run <code className="font-mono bg-muted px-1 py-0.5 rounded">/setup</code> in
							Discord to initialize your server.
						</p>
					</div>
				) : (
					<>
						{/* Summary */}
						<div className="flex items-center gap-4 mb-2 text-sm">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
								<span className="text-muted-foreground">
									{Object.values(setupState.systemStates).filter((s) => s === "complete").length} configured
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Circle className="h-3.5 w-3.5 text-yellow-500" />
								<span className="text-muted-foreground">
									{Object.values(setupState.systemStates).filter((s) => s === "partial").length} in progress
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<span>
									{SYSTEMS.filter((s) =>
										isSystemEnabled(setupState.selectedSystems, s.id),
									).length}/{SYSTEMS.length} enabled
								</span>
							</div>
						</div>

						{SYSTEMS.map((system) => {
							const enabled = isSystemEnabled(setupState.selectedSystems, system.id);
							const state = setupState.systemStates[system.id] ?? "not_started";
							return (
								<SystemCard
									key={system.id}
									system={system}
									enabled={enabled}
									state={state}
									onToggle={() => handleToggle(system.id, enabled)}
									isPending={toggleSystem.isPending}
									guildId={guildId}
								/>
							);
						})}
					</>
				)}
			</div>
		</FadeIn>
	);
}
