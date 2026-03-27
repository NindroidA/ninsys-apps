import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
	useAddRoutingRule,
	useDeleteRoutingRule,
	useRoutingConfig,
	useRoutingStats,
	useUpdateRoutingConfig,
} from "@/hooks/useRouting";
import type { RoutingRule, StaffWorkload } from "@/types/routing";
import { Badge, Button, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { GitBranch, Plus, Route, Ticket, Trash2, Users } from "lucide-react";
import { useCallback, useState } from "react";

const STRATEGY_OPTIONS = [
	{
		value: "least_load",
		label: "Least Load",
		description: "Assign to staff with fewest open tickets",
	},
	{
		value: "round_robin",
		label: "Round Robin",
		description: "Cycle through staff members equally",
	},
	{
		value: "random",
		label: "Random",
		description: "Randomly assign to available staff",
	},
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

export function RoutingPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Smart Routing");

	const { data: config, isLoading: configLoading } = useRoutingConfig(guildId);
	const updateConfig = useUpdateRoutingConfig(guildId);
	const addRule = useAddRoutingRule(guildId);
	const deleteRule = useDeleteRoutingRule(guildId);
	const { data: stats, isLoading: statsLoading } = useRoutingStats(guildId);

	const [newTypeId, setNewTypeId] = useState("");
	const [newRoleId, setNewRoleId] = useState<string | null>(null);
	const [newMaxOpen, setNewMaxOpen] = useState("5");

	const handleAddRule = useCallback(() => {
		if (!newTypeId || !newRoleId) return;
		addRule.mutate(
			{
				ticketTypeId: newTypeId,
				staffRoleId: newRoleId,
				maxOpen: Math.min(50, Math.max(1, Number.parseInt(newMaxOpen, 10) || 5)),
			},
			{
				onSuccess: () => {
					setNewTypeId("");
					setNewRoleId(null);
					setNewMaxOpen("5");
				},
			},
		);
	}, [newTypeId, newRoleId, newMaxOpen, addRule]);

	if (configLoading) return <TabFallback />;

	const ruleColumns: Column<RoutingRule>[] = [
		{ key: "ticketTypeName", header: "Ticket Type" },
		{ key: "staffRoleName", header: "Staff Role" },
		{
			key: "maxOpen",
			header: "Max Open",
			width: "100px",
		},
	];

	const workloadColumns: Column<StaffWorkload>[] = [
		{ key: "username", header: "Staff" },
		{ key: "openTickets", header: "Open Tickets", width: "120px" },
		{
			key: "status",
			header: "Status",
			render: (r) => (
				<Badge
					variant={
						r.status === "available"
							? "default"
							: r.status === "at_capacity"
								? "secondary"
								: "error"
					}
				>
					{r.status === "at_capacity" ? "At Capacity" : r.status}
				</Badge>
			),
			width: "120px",
		},
	];

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Smart Routing"
				description="Automatically assign tickets to the right staff members"
			/>

			<div className="space-y-6">
				{!configLoading && !config && (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<p className="text-muted-foreground">Smart routing is not configured yet.</p>
						<p className="text-xs text-muted-foreground mt-1">
							This feature requires the ticket workflow to be enabled first.
						</p>
						<a
							href="tickets?tab=config"
							className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
						>
							Go to Ticket Settings →
						</a>
					</div>
				)}
				{config && (
					<>
						<StatusToggle
							enabled={config.enabled}
							onChange={(enabled) => updateConfig.mutate({ enabled })}
							label="Smart Routing"
							description="Enable automatic ticket routing to staff"
							disabled={updateConfig.isPending}
						/>

						<ConfigSection title="Routing Strategy" description="How tickets are assigned to staff">
							<Select
								value={config.strategy}
								onChange={(value) =>
									updateConfig.mutate({
										strategy: value as "least_load" | "round_robin" | "random",
									})
								}
								options={STRATEGY_OPTIONS}
								label="Strategy"
							/>
						</ConfigSection>

						{/* Routing Rules */}
						<ConfigSection
							title="Routing Rules"
							description="Map ticket types to specific staff roles"
						>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div>
									<label className="text-sm font-medium block mb-1.5">Ticket Type ID</label>
									<input
										type="text"
										value={newTypeId}
										onChange={(e) => setNewTypeId(e.target.value.replace(/[^a-z0-9-_]/gi, ""))}
										placeholder="e.g. support"
										maxLength={50}
										className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
									/>
								</div>
								<RolePicker
									guildId={guildId}
									value={newRoleId}
									onChange={(v) => setNewRoleId(typeof v === "string" ? v : null)}
									label="Staff Role"
									placeholder="Select staff role"
								/>
								<div>
									<label className="text-sm font-medium block mb-1.5">Max Open</label>
									<input
										type="number"
										min={1}
										max={50}
										value={newMaxOpen}
										onChange={(e) => setNewMaxOpen(e.target.value)}
										className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
									/>
								</div>
							</div>
							<Button
								onClick={handleAddRule}
								disabled={!newTypeId || !newRoleId || addRule.isPending}
								className="mt-2"
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Rule
							</Button>
						</ConfigSection>

						<DataTable
							data={config.rules}
							columns={ruleColumns}
							getRowKey={(r) => r.id}
							emptyState={{
								title: "No routing rules",
								description: "Add rules to map ticket types to staff roles",
								icon: Route,
							}}
							rowActions={(row) => [
								{
									label: "Delete",
									icon: Trash2,
									variant: "destructive",
									onClick: () => deleteRule.mutate(row.id),
								},
							]}
						/>
					</>
				)}

				{/* Stats */}
				{!statsLoading && stats && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<Card className="p-4">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-primary/10 p-2">
										<GitBranch className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-lg font-bold capitalize">
											{stats.currentStrategy.replace(/_/g, " ")}
										</p>
										<p className="text-sm text-muted-foreground">Current Strategy</p>
									</div>
								</div>
							</Card>

							<Card className="p-4">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-accent/10 p-2">
										<Ticket className="h-5 w-5 text-accent" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.openTickets}</p>
										<p className="text-sm text-muted-foreground">Open</p>
									</div>
								</div>
							</Card>

							<Card className="p-4">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-green-500/10 p-2">
										<Users className="h-5 w-5 text-green-500" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.assignedTickets}</p>
										<p className="text-sm text-muted-foreground">Assigned</p>
									</div>
								</div>
							</Card>
						</div>

						{stats.workload.length > 0 && (
							<ConfigSection
								title="Staff Workload"
								description="Current ticket distribution across staff"
							>
								<DataTable
									data={stats.workload}
									columns={workloadColumns}
									getRowKey={(r) => r.userId}
									emptyState={{
										title: "No staff data",
										icon: Users,
									}}
								/>
							</ConfigSection>
						)}
					</>
				)}
			</div>
		</FadeIn>
	);
}
