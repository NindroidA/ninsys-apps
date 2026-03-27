import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { Tabs } from "@/components/ui/Tabs";
import { useBaitChannelConfig, useUpdateBaitChannelConfig } from "@/hooks/useBaitChannel";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Activity, BarChart3, FileText, Key, Settings, Shield } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const BaitConfigTab = lazy(() =>
	import("@/components/bait-channel/BaitConfigTab").then((m) => ({
		default: m.BaitConfigTab,
	})),
);
const BaitKeywordsTab = lazy(() =>
	import("@/components/bait-channel/BaitKeywordsTab").then((m) => ({
		default: m.BaitKeywordsTab,
	})),
);
const BaitWhitelistTab = lazy(() =>
	import("@/components/bait-channel/BaitWhitelistTab").then((m) => ({
		default: m.BaitWhitelistTab,
	})),
);
const BaitLogsTab = lazy(() =>
	import("@/components/bait-channel/BaitLogsTab").then((m) => ({
		default: m.BaitLogsTab,
	})),
);
const BaitJoinVelocityTab = lazy(() =>
	import("@/components/bait-channel/BaitJoinVelocityTab").then((m) => ({
		default: m.BaitJoinVelocityTab,
	})),
);
const BaitStatsTab = lazy(() =>
	import("@/components/bait-channel/BaitStatsTab").then((m) => ({
		default: m.BaitStatsTab,
	})),
);

const TABS = [
	{ id: "config", label: "Config", icon: Settings },
	{ id: "keywords", label: "Keywords", icon: Key },
	{ id: "whitelist", label: "Whitelist", icon: Shield },
	{ id: "logs", label: "Logs", icon: FileText },
	{ id: "joins", label: "Join Events", icon: Activity },
	{ id: "stats", label: "Stats", icon: BarChart3 },
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

export function BaitChannelPage() {
	const { guildId } = useCurrentGuild();
	const { data: config, isLoading } = useBaitChannelConfig(guildId);
	const updateConfig = useUpdateBaitChannelConfig(guildId);
	usePageTitle("Bait Channel");

	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") ?? "config";

	const handleTabChange = useCallback(
		(tab: string) => {
			setSearchParams({ tab }, { replace: true });
		},
		[setSearchParams],
	);

	const handleToggle = useCallback(
		(enabled: boolean) => {
			updateConfig.mutate({ enabled });
		},
		[updateConfig],
	);

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Bait Channel"
				description="Configure honeypot channel detection and automated moderation"
			/>

			<div className="space-y-6">
				{!isLoading && config && (
					<StatusToggle
						enabled={config.enabled}
						onChange={handleToggle}
						label="Bait Channel System"
						description="Enable or disable the bait channel detection"
						disabled={updateConfig.isPending}
					/>
				)}

				<Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

				<Suspense fallback={<TabFallback />}>
					{activeTab === "config" && <BaitConfigTab guildId={guildId} />}
					{activeTab === "keywords" && <BaitKeywordsTab guildId={guildId} />}
					{activeTab === "whitelist" && <BaitWhitelistTab guildId={guildId} />}
					{activeTab === "logs" && <BaitLogsTab guildId={guildId} />}
					{activeTab === "joins" && <BaitJoinVelocityTab guildId={guildId} />}
					{activeTab === "stats" && <BaitStatsTab guildId={guildId} />}
				</Suspense>
			</div>
		</FadeIn>
	);
}
