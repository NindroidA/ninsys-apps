import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Database, FileText } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const MemoryChannelsTab = lazy(() =>
  import("@/components/memory/MemoryChannelsTab").then((m) => ({
    default: m.MemoryChannelsTab,
  }))
);
const MemoryItemsTab = lazy(() =>
  import("@/components/memory/MemoryItemsTab").then((m) => ({
    default: m.MemoryItemsTab,
  }))
);

const TABS = [
  { id: "channels", label: "Channels", icon: Database },
  { id: "items", label: "Items", icon: FileText },
];

function TabFallback() {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function MemoryPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("Memory");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "channels";

  const handleTabChange = useCallback(
    (tab: string) => {
      setSearchParams({ tab }, { replace: true });
    },
    [setSearchParams]
  );

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Memory System"
        description="Manage memory channels, tags, and items"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        <Suspense fallback={<TabFallback />}>
          {activeTab === "channels" && <MemoryChannelsTab guildId={guildId} />}
          {activeTab === "items" && <MemoryItemsTab guildId={guildId} />}
        </Suspense>
      </div>
    </FadeIn>
  );
}
