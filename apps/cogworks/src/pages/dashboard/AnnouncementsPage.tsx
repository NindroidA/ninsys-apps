import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useAnnouncementConfig } from "@/hooks/useAnnouncements";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { FileText, History, Megaphone, Settings } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const AnnouncementConfigTab = lazy(() =>
	import("@/components/announcements/AnnouncementConfigTab").then((m) => ({
		default: m.AnnouncementConfigTab,
	})),
);
const AnnouncementSendTab = lazy(() =>
	import("@/components/announcements/AnnouncementSendTab").then((m) => ({
		default: m.AnnouncementSendTab,
	})),
);
const AnnouncementHistoryTab = lazy(() =>
	import("@/components/announcements/AnnouncementHistoryTab").then((m) => ({
		default: m.AnnouncementHistoryTab,
	})),
);
const AnnouncementTemplatesTab = lazy(() =>
	import("@/components/announcements/AnnouncementTemplatesTab").then((m) => ({
		default: m.AnnouncementTemplatesTab,
	})),
);

const TABS = [
	{ id: "config", label: "Config", icon: Settings },
	{ id: "templates", label: "Templates", icon: FileText },
	{ id: "send", label: "Send", icon: Megaphone },
	{ id: "history", label: "History", icon: History },
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

export function AnnouncementsPage() {
	const { guildId } = useCurrentGuild();
	const { data: config } = useAnnouncementConfig(guildId);
	usePageTitle("Announcements");

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
			<PageHeader title="Announcement System" description="Send and manage server announcements" />

			<div className="space-y-6">
				<Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

				<Suspense fallback={<TabFallback />}>
					{activeTab === "config" && <AnnouncementConfigTab guildId={guildId} />}
					{activeTab === "templates" && <AnnouncementTemplatesTab guildId={guildId} />}
					{activeTab === "send" && (
						<AnnouncementSendTab
							guildId={guildId}
							defaultChannelId={config?.defaultChannelId ?? null}
						/>
					)}
					{activeTab === "history" && <AnnouncementHistoryTab guildId={guildId} />}
				</Suspense>
			</div>
		</FadeIn>
	);
}
