import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { ChannelActivity } from "@/components/analytics/ChannelActivity";
import { GrowthChart } from "@/components/analytics/GrowthChart";
import { KpiCards } from "@/components/analytics/KpiCards";
import { PeriodSelector, useAnalyticsPeriodParam } from "@/components/analytics/PeriodSelector";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import {
	useAnalyticsChannels,
	useAnalyticsConfig,
	useAnalyticsGrowth,
	useAnalyticsHours,
	useAnalyticsOverview,
	useUpdateAnalyticsConfig,
} from "@/hooks/useAnalytics";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { BarChart3, Settings } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const TABS = [
	{ id: "config", label: "Config", icon: Settings },
	{ id: "dashboard", label: "Dashboard", icon: BarChart3 },
];

const FREQUENCY_OPTIONS = [
	{ value: "weekly", label: "Weekly" },
	{ value: "monthly", label: "Monthly" },
	{ value: "both", label: "Both" },
];

const DAY_OPTIONS = [
	{ value: "0", label: "Sunday" },
	{ value: "1", label: "Monday" },
	{ value: "2", label: "Tuesday" },
	{ value: "3", label: "Wednesday" },
	{ value: "4", label: "Thursday" },
	{ value: "5", label: "Friday" },
	{ value: "6", label: "Saturday" },
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

// --- Config Tab ---

function AnalyticsConfigTab({ guildId }: { guildId: string }) {
	const { data: config, isLoading } = useAnalyticsConfig(guildId);
	const updateConfig = useUpdateAnalyticsConfig(guildId);

	if (isLoading) return <TabFallback />;
	if (!config)
		return (
			<div className="text-center py-12 border border-dashed border-border rounded-lg max-w-4xl">
				<p className="text-muted-foreground">This feature is not configured yet.</p>
				<p className="text-xs text-muted-foreground mt-1">
					Set it up via Discord commands or check back later.
				</p>
			</div>
		);

	return (
		<div className="space-y-6 max-w-4xl">
			<StatusToggle
				enabled={config.enabled}
				onChange={(enabled) => updateConfig.mutate({ enabled })}
				label="Server Analytics"
				description="Enable analytics tracking and digest reports"
				disabled={updateConfig.isPending}
			/>

			<ConfigSection title="Digest Settings" description="Configure automated analytics digests">
				<ChannelPicker
					guildId={guildId}
					value={config.digestChannelId}
					onChange={(channelId) => updateConfig.mutate({ digestChannelId: channelId })}
					filter="text"
					label="Digest Channel"
					placeholder="Select digest channel"
					clearable
				/>

				<Select
					value={config.frequency}
					onChange={(value) =>
						updateConfig.mutate({
							frequency: value as "weekly" | "monthly" | "both",
						})
					}
					options={FREQUENCY_OPTIONS}
					label="Digest Frequency"
				/>

				<Select
					value={String(config.digestDay)}
					onChange={(value) => updateConfig.mutate({ digestDay: Number.parseInt(value, 10) })}
					options={DAY_OPTIONS}
					label="Digest Day"
				/>
			</ConfigSection>
		</div>
	);
}

// --- Dashboard Tab ---

function AnalyticsDashboardTab({ guildId }: { guildId: string }) {
	const [period, setPeriod] = useAnalyticsPeriodParam();

	const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview(guildId, period);
	const { data: growth, isLoading: growthLoading } = useAnalyticsGrowth(guildId, period);
	const { data: channels, isLoading: channelsLoading } = useAnalyticsChannels(guildId, period);
	const { data: hours, isLoading: hoursLoading } = useAnalyticsHours(guildId, period);

	return (
		<div className="space-y-6 max-w-6xl">
			{/* Period selector */}
			<div className="flex items-center justify-between flex-wrap gap-2">
				<p className="text-sm text-muted-foreground">Server activity and growth metrics · UTC</p>
				<PeriodSelector value={period} onChange={setPeriod} />
			</div>

			{/* KPI cards */}
			<KpiCards overview={overview} isLoading={overviewLoading} />

			{/* Growth chart */}
			<GrowthChart growth={growth} period={period} isLoading={growthLoading} />

			{/* Channel activity + Activity heatmap */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChannelActivity channels={channels} isLoading={channelsLoading} />
				<ActivityHeatmap hours={hours} isLoading={hoursLoading} />
			</div>
		</div>
	);
}

// --- Page ---

export function ServerAnalyticsPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Server Analytics");

	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") ?? "config";

	const handleTabChange = useCallback(
		(tab: string) => {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set("tab", tab);
					return next;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	return (
		<FadeIn>
			<PageHeader
				title="Server Analytics"
				description="Track server activity, growth, and engagement metrics"
			/>

			<div className="space-y-6">
				<Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

				{activeTab === "config" && <AnalyticsConfigTab guildId={guildId} />}
				{activeTab === "dashboard" && <AnalyticsDashboardTab guildId={guildId} />}
			</div>
		</FadeIn>
	);
}
