import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { Slider } from "@/components/ui/Slider";
import { Tabs } from "@/components/ui/Tabs";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useStarboardConfig,
  useUpdateStarboardConfig,
  useStarredMessages,
  useStarboardStats,
} from "@/hooks/useStarboard";
import type { StarredMessage } from "@/types/starboard";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Card } from "@ninsys/ui/components";
import { BarChart3, MessageSquare, Settings, Star, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TABS = [
  { id: "config", label: "Config", icon: Settings },
  { id: "messages", label: "Messages", icon: MessageSquare },
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

function StarboardConfigTab({ guildId }: { guildId: string }) {
  const { data: config, isLoading } = useStarboardConfig(guildId);
  const updateConfig = useUpdateStarboardConfig(guildId);

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
        label="Starboard"
        description="Enable or disable the starboard system"
        disabled={updateConfig.isPending}
      />

      <ConfigSection title="Starboard Settings">
        <ChannelPicker
          guildId={guildId}
          value={config.channelId}
          onChange={(channelId) => updateConfig.mutate({ channelId })}
          filter="text"
          label="Starboard Channel"
          placeholder="Select starboard channel"
          clearable
        />

        <EmojiPicker
          value={config.emoji}
          onChange={(emoji) => updateConfig.mutate({ emoji })}
          label="Star Emoji"
        />

        <Slider
          value={config.threshold}
          onChange={(threshold) => updateConfig.mutate({ threshold })}
          min={1}
          max={25}
          label="Star Threshold"
          valueFormat={(v) => `${v} star${v !== 1 ? "s" : ""}`}
        />
      </ConfigSection>

      <ConfigSection title="Behavior">
        <StatusToggle
          enabled={config.allowSelfStar}
          onChange={(allowSelfStar) => updateConfig.mutate({ allowSelfStar })}
          label="Allow Self-Star"
          description="Let users star their own messages"
        />
        <StatusToggle
          enabled={config.ignoreBots}
          onChange={(ignoreBots) => updateConfig.mutate({ ignoreBots })}
          label="Ignore Bots"
          description="Exclude bot messages from the starboard"
        />
        <StatusToggle
          enabled={config.ignoreNsfw}
          onChange={(ignoreNsfw) => updateConfig.mutate({ ignoreNsfw })}
          label="Ignore NSFW"
          description="Exclude messages from NSFW channels"
        />
      </ConfigSection>

      <ConfigSection title="Ignored Channels">
        <p className="text-sm text-muted-foreground">
          {config.ignoredChannelIds.length === 0
            ? "No channels are being ignored."
            : `${config.ignoredChannelIds.length} channel(s) excluded from starboard.`}
        </p>
      </ConfigSection>
    </div>
  );
}

// --- Messages Tab ---

function StarboardMessagesTab({ guildId }: { guildId: string }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"stars" | "date">("stars");
  const { data, isLoading } = useStarredMessages(guildId, page, sort);

  const columns: Column<StarredMessage>[] = [
    { key: "authorUsername", header: "Author" },
    {
      key: "content",
      header: "Content",
      render: (r) => (
        <span className="line-clamp-2 max-w-xs" title={r.content}>
          {r.content || "(attachment)"}
        </span>
      ),
    },
    {
      key: "starCount",
      header: "Stars",
      render: (r) => (
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          {r.starCount}
        </span>
      ),
      width: "80px",
    },
    {
      key: "createdAt",
      header: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
      width: "100px",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "stars" | "date");
            setPage(1);
          }}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="stars">Most Stars</option>
          <option value="date">Most Recent</option>
        </select>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        getRowKey={(r) => r.id}
        emptyState={{
          title: "No starred messages",
          description:
            "Messages that reach the star threshold will appear here",
          icon: Star,
        }}
      />
    </div>
  );
}

// --- Stats Tab ---

function StarboardStatsTab({ guildId }: { guildId: string }) {
  const { data: stats, isLoading } = useStarboardStats(guildId);

  if (isLoading) return <TabFallback />;
  if (!stats) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No starboard statistics available yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStarred}</p>
              <p className="text-sm text-muted-foreground">Total Starred</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.mostStarred?.starCount ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Most Stars on a Message
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.topUsers.length}</p>
              <p className="text-sm text-muted-foreground">Top Contributors</p>
            </div>
          </div>
        </Card>
      </div>

      {stats.topUsers.length > 0 && (
        <ConfigSection title="Top Starred Users">
          <div className="space-y-2">
            {stats.topUsers.map((user, i) => (
              <div
                key={user.userId}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {user.count} starred message{user.count !== 1 ? "s" : ""}
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

export function StarboardPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("Starboard");

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
        title="Starboard"
        description="Highlight popular messages with a star-based voting system"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "config" && <StarboardConfigTab guildId={guildId} />}
        {activeTab === "messages" && <StarboardMessagesTab guildId={guildId} />}
        {activeTab === "stats" && <StarboardStatsTab guildId={guildId} />}
      </div>
    </FadeIn>
  );
}
