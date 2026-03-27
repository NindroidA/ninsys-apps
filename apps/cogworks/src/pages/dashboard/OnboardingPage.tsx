import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import {
	useDeleteOnboardingStep,
	useOnboardingConfig,
	useOnboardingStats,
	useOnboardingSteps,
	useUpdateOnboardingConfig,
} from "@/hooks/useOnboarding";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
	BarChart3,
	CheckCircle,
	ListChecks,
	Settings,
	Trash2,
	TrendingDown,
	UserPlus,
	Users,
} from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const TABS = [
	{ id: "config", label: "Config", icon: Settings },
	{ id: "steps", label: "Steps", icon: ListChecks },
	{ id: "stats", label: "Stats", icon: BarChart3 },
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

// --- Config Tab ---

function OnboardingConfigTab({ guildId }: { guildId: string }) {
	const { data: config, isLoading } = useOnboardingConfig(guildId);
	const updateConfig = useUpdateOnboardingConfig(guildId);

	if (isLoading) return <TabFallback />;
	if (!config)
		return (
			<div className="text-center py-12 border border-dashed border-border rounded-lg">
				<p className="text-muted-foreground">This feature is not configured yet.</p>
				<p className="text-xs text-muted-foreground mt-1">
					Set it up via Discord commands or check back later.
				</p>
			</div>
		);

	return (
		<div className="space-y-6">
			<StatusToggle
				enabled={config.enabled}
				onChange={(enabled) => updateConfig.mutate({ enabled })}
				label="Onboarding System"
				description="Enable guided onboarding for new members"
				disabled={updateConfig.isPending}
			/>

			<ConfigSection title="Welcome Message">
				<div>
					<label className="text-sm font-medium block mb-1.5">Welcome Message Template</label>
					<textarea
						value={config.welcomeMessage ?? ""}
						onChange={(e) => updateConfig.mutate({ welcomeMessage: e.target.value || null })}
						placeholder="Welcome to the server, {user}! Follow the steps below to get started."
						rows={4}
						maxLength={2000}
						className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
					/>
					<p className="text-xs text-muted-foreground mt-1">
						Placeholders: {"{user}"}, {"{server}"}, {"{memberCount}"}
					</p>
				</div>
			</ConfigSection>

			<ConfigSection title="Completion">
				<RolePicker
					guildId={guildId}
					value={config.completionRoleId}
					onChange={(v) =>
						updateConfig.mutate({
							completionRoleId: typeof v === "string" ? v : null,
						})
					}
					label="Completion Role"
					placeholder="Role to assign on completion"
					clearable
				/>
			</ConfigSection>
		</div>
	);
}

// --- Steps Tab ---

function OnboardingStepsTab({ guildId }: { guildId: string }) {
	const { data: steps = [], isLoading } = useOnboardingSteps(guildId);
	const deleteStep = useDeleteOnboardingStep(guildId);

	if (isLoading) return <TabFallback />;

	const TYPE_LABELS: Record<string, string> = {
		message: "Message",
		role_select: "Role Select",
		channel_suggest: "Channel Suggest",
		rules_accept: "Rules Accept",
		custom_question: "Custom Question",
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{steps.length} step{steps.length !== 1 ? "s" : ""} configured
				</p>
			</div>

			{steps.length === 0 ? (
				<Card className="py-12 text-center">
					<ListChecks className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
					<p className="font-medium">No onboarding steps</p>
					<p className="text-sm text-muted-foreground mt-1">
						Add steps to create a guided onboarding flow
					</p>
				</Card>
			) : (
				<div className="space-y-3">
					{steps.map((step, i) => (
						<Card key={step.id} className="p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-3 min-w-0">
									<span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center mt-0.5">
										{i + 1}
									</span>
									<div className="min-w-0">
										<h3 className="font-medium">{step.title}</h3>
										<p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
											{step.description}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<Badge variant="secondary">{TYPE_LABELS[step.type] ?? step.type}</Badge>
											{step.required && <Badge variant="default">Required</Badge>}
										</div>
									</div>
								</div>
								<button
									type="button"
									onClick={() => deleteStep.mutate(step.id)}
									className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0 ml-2"
									aria-label="Delete step"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

// --- Stats Tab ---

function OnboardingStatsTab({ guildId }: { guildId: string }) {
	const { data: stats, isLoading } = useOnboardingStats(guildId);

	if (isLoading) return <TabFallback />;
	if (!stats) {
		return (
			<p className="text-sm text-muted-foreground py-8 text-center">
				No onboarding statistics available yet.
			</p>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-1">
						<CheckCircle className="h-4 w-4 text-green-500" />
						<span className="text-xs text-muted-foreground">Completion Rate</span>
					</div>
					<p className="text-xl font-bold">{Math.round(stats.completionRate)}%</p>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-1">
						<UserPlus className="h-4 w-4 text-primary" />
						<span className="text-xs text-muted-foreground">Started</span>
					</div>
					<p className="text-xl font-bold">{stats.started.toLocaleString()}</p>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-1">
						<Users className="h-4 w-4 text-primary" />
						<span className="text-xs text-muted-foreground">Completed</span>
					</div>
					<p className="text-xl font-bold">{stats.completed.toLocaleString()}</p>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-1">
						<BarChart3 className="h-4 w-4 text-primary" />
						<span className="text-xs text-muted-foreground">Avg Time</span>
					</div>
					<p className="text-xl font-bold">{Math.round(stats.averageCompletionMinutes)}m</p>
				</Card>
			</div>

			{stats.dropOff.length > 0 && (
				<ConfigSection title="Drop-off Points" description="Steps where users abandon onboarding">
					<div className="space-y-2">
						{stats.dropOff.map((item) => (
							<div
								key={item.stepId}
								className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
							>
								<span className="text-sm">{item.stepTitle}</span>
								<span className="text-sm text-destructive flex items-center gap-1">
									<TrendingDown className="h-3 w-3" />
									{item.dropCount} dropped
								</span>
							</div>
						))}
					</div>
				</ConfigSection>
			)}
		</div>
	);
}

// --- Page ---

export function OnboardingPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Onboarding");

	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") ?? "config";

	const handleTabChange = useCallback(
		(tab: string) => {
			setSearchParams({ tab }, { replace: true });
		},
		[setSearchParams],
	);

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Onboarding"
				description="Guide new members through a structured onboarding process"
			/>

			<div className="space-y-6">
				<Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

				{activeTab === "config" && <OnboardingConfigTab guildId={guildId} />}
				{activeTab === "steps" && <OnboardingStepsTab guildId={guildId} />}
				{activeTab === "stats" && <OnboardingStatsTab guildId={guildId} />}
			</div>
		</FadeIn>
	);
}
