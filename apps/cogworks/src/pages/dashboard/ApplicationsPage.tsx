import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Briefcase, ClipboardList, Settings } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const ApplicationConfigTab = lazy(() =>
  import("@/components/applications/ApplicationConfigTab").then((m) => ({
    default: m.ApplicationConfigTab,
  }))
);
const ApplicationPositionsTab = lazy(() =>
  import("@/components/applications/ApplicationPositionsTab").then((m) => ({
    default: m.ApplicationPositionsTab,
  }))
);
const ApplicationActiveTab = lazy(() =>
  import("@/components/applications/ApplicationActiveTab").then((m) => ({
    default: m.ApplicationActiveTab,
  }))
);

const TABS = [
  { id: "config", label: "Config", icon: Settings },
  { id: "positions", label: "Positions", icon: Briefcase },
  { id: "active", label: "Active", icon: ClipboardList },
];

function TabFallback() {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function ApplicationsPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("Applications");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "config";

  const handleTabChange = useCallback(
    (tab: string) => {
      setSearchParams({ tab }, { replace: true });
    },
    [setSearchParams]
  );

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Application System"
        description="Manage applications for your server"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        <Suspense fallback={<TabFallback />}>
          {activeTab === "config" && <ApplicationConfigTab guildId={guildId} />}
          {activeTab === "positions" && (
            <ApplicationPositionsTab guildId={guildId} />
          )}
          {activeTab === "active" && <ApplicationActiveTab guildId={guildId} />}
        </Suspense>
      </div>
    </FadeIn>
  );
}
