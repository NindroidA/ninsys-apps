import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useAnalyticsConfig,
  useUpdateAnalyticsConfig,
  useAnalyticsDashboard,
} from "@/hooks/useAnalytics";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Card } from "@ninsys/ui/components";
import {
  BarChart3,
  Hash,
  MessageSquare,
  Mic,
  Settings,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
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
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">
          This feature is not configured yet.
        </p>
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
        label="Server Analytics"
        description="Enable analytics tracking and digest reports"
        disabled={updateConfig.isPending}
      />

      <ConfigSection
        title="Digest Settings"
        description="Configure automated analytics digests"
      >
        <ChannelPicker
          guildId={guildId}
          value={config.digestChannelId}
          onChange={(channelId) =>
            updateConfig.mutate({ digestChannelId: channelId })
          }
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
          onChange={(value) =>
            updateConfig.mutate({ digestDay: Number.parseInt(value, 10) })
          }
          options={DAY_OPTIONS}
          label="Digest Day"
        />
      </ConfigSection>
    </div>
  );
}

// --- Dashboard Tab ---

function AnalyticsDashboardTab({ guildId }: { guildId: string }) {
  const { data: dashboard, isLoading } = useAnalyticsDashboard(guildId);

  if (isLoading) return <TabFallback />;
  if (!dashboard) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No analytics data available yet. Enable analytics to start tracking.
      </p>
    );
  }

  const { overview } = dashboard;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Messages</span>
          </div>
          <p className="text-xl font-bold">
            {overview.messages.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Active Members
            </span>
          </div>
          <p className="text-xl font-bold">
            {overview.activeMembers.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Joins</span>
          </div>
          <p className="text-xl font-bold">{overview.joins.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserMinus className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Leaves</span>
          </div>
          <p className="text-xl font-bold">
            {overview.leaves.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Voice Hours</span>
          </div>
          <p className="text-xl font-bold">
            {Math.round(overview.voiceMinutes / 60).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Growth Chart Placeholder */}
      <ConfigSection
        title="Member Growth"
        description="Server member count over time"
      >
        {dashboard.growth.length > 0 ? (
          <div className="space-y-2">
            {dashboard.growth.slice(-7).map((point) => (
              <div
                key={point.date}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{point.date}</span>
                <span className="font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  {point.memberCount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Growth data will appear as it is collected.
          </p>
        )}
      </ConfigSection>

      {/* Top Channels */}
      <ConfigSection
        title="Top Channels"
        description="Most active channels by message count"
      >
        {dashboard.topChannels.length > 0 ? (
          <div className="space-y-2">
            {dashboard.topChannels.slice(0, 10).map((ch) => {
              const maxCount = dashboard.topChannels[0]?.messageCount ?? 1;
              const pct = Math.round((ch.messageCount / maxCount) * 100);
              return (
                <div key={ch.channelId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      {ch.channelName}
                    </span>
                    <span className="text-muted-foreground">
                      {ch.messageCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Channel activity data will appear as it is collected.
          </p>
        )}
      </ConfigSection>

      {/* Activity Heatmap Placeholder */}
      <ConfigSection
        title="Activity Heatmap"
        description={`Peak hour: ${dashboard.peakHour}:00 UTC`}
      >
        <p className="text-sm text-muted-foreground">
          Activity heatmap visualization coming soon. Data is being collected in
          the background.
        </p>
      </ConfigSection>
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
      setSearchParams({ tab }, { replace: true });
    },
    [setSearchParams]
  );

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Server Analytics"
        description="Track server activity, growth, and engagement metrics"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "config" && <AnalyticsConfigTab guildId={guildId} />}
        {activeTab === "dashboard" && (
          <AnalyticsDashboardTab guildId={guildId} />
        )}
      </div>
    </FadeIn>
  );
}
