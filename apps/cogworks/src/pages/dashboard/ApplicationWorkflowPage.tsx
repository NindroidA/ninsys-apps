import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
	useApplicationConfig,
	useUpdateApplicationConfig,
} from "@/hooks/useApplications";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Badge, Card } from "@ninsys/ui/components";
import {
	ArrowRight,
	CheckCircle,
	FileText,
	Info,
	XCircle,
	Archive,
} from "lucide-react";

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

const WORKFLOW_STATUSES = [
	{
		id: "pending",
		label: "Pending",
		description: "Application submitted, awaiting review",
		icon: FileText,
		color: "text-yellow-500",
		bgColor: "bg-yellow-500/10",
	},
	{
		id: "approved",
		label: "Approved",
		description: "Application accepted by staff",
		icon: CheckCircle,
		color: "text-green-500",
		bgColor: "bg-green-500/10",
	},
	{
		id: "denied",
		label: "Denied",
		description: "Application rejected with reason",
		icon: XCircle,
		color: "text-destructive",
		bgColor: "bg-destructive/10",
	},
	{
		id: "archived",
		label: "Archived",
		description: "Application moved to archive",
		icon: Archive,
		color: "text-muted-foreground",
		bgColor: "bg-muted",
	},
];

export function ApplicationWorkflowPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Application Workflow");

	const { data: config, isLoading } = useApplicationConfig(guildId);
	const updateConfig = useUpdateApplicationConfig(guildId);

	if (isLoading) return <TabFallback />;

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Application Workflow"
				description="Configure the application review pipeline"
			/>

			<div className="space-y-6">
				{config && (
					<StatusToggle
						enabled={config.enabled}
						onChange={(enabled) => updateConfig.mutate({ enabled })}
						label="Application System"
						description="Enable or disable the application system"
						disabled={updateConfig.isPending}
					/>
				)}

				{/* Workflow Status Pipeline */}
				<ConfigSection
					title="Workflow Statuses"
					description="Applications progress through these statuses"
				>
					<div className="space-y-3">
						{WORKFLOW_STATUSES.map((status, i) => (
							<div key={status.id}>
								<div className="flex items-start gap-3 rounded-lg border border-border p-3">
									<div className={`rounded-lg p-2 ${status.bgColor} flex-shrink-0`}>
										<status.icon className={`h-5 w-5 ${status.color}`} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<h3 className="font-medium">{status.label}</h3>
											<Badge variant="secondary">{status.id}</Badge>
										</div>
										<p className="text-sm text-muted-foreground mt-0.5">
											{status.description}
										</p>
									</div>
								</div>
								{i < WORKFLOW_STATUSES.length - 1 && (
									<div className="flex justify-center py-1">
										<ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
									</div>
								)}
							</div>
						))}
					</div>
				</ConfigSection>

				{/* Info Note */}
				<Card className="p-4 border-primary/20 bg-primary/[0.03]">
					<div className="flex items-start gap-3">
						<Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
						<div>
							<h3 className="font-medium text-sm">Discord Commands</h3>
							<p className="text-sm text-muted-foreground mt-1">
								Staff members can manage applications directly in Discord using
								the following commands:
							</p>
							<ul className="text-sm text-muted-foreground mt-2 space-y-1">
								<li>
									<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
										/application review
									</code>{" "}
									- Review a pending application
								</li>
								<li>
									<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
										/application approve
									</code>{" "}
									- Approve an application with optional note
								</li>
								<li>
									<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
										/application deny
									</code>{" "}
									- Deny an application with reason
								</li>
								<li>
									<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
										/application archive
									</code>{" "}
									- Archive a completed application
								</li>
							</ul>
						</div>
					</div>
				</Card>
			</div>
		</FadeIn>
	);
}
