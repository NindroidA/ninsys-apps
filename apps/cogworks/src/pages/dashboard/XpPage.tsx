import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { RolePicker } from "@/components/discord/RolePicker";
import { Slider } from "@/components/ui/Slider";
import { Tabs } from "@/components/ui/Tabs";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useXpConfig,
  useUpdateXpConfig,
  useRoleRewards,
  useAddRoleReward,
  useDeleteRoleReward,
  useChannelMultipliers,
  useRemoveChannelMultiplier,
  useXpLeaderboard,
  useXpImportHistory,
  useImportMee6,
} from "@/hooks/useXp";
import type { LeaderboardEntry, RoleReward, XpImportResult } from "@/types/xp";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Badge, Button } from "@ninsys/ui/components";
import {
  Award,
  BarChart3,
  Download,
  Gift,
  Plus,
  Settings,
  Trash2,
  Trophy,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TABS = [
  { id: "config", label: "Config", icon: Settings },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "import", label: "Import", icon: Download },
];

function TabFallback() {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

// --- Config Tab ---

function XpConfigTab({ guildId }: { guildId: string }) {
  const { data: config, isLoading } = useXpConfig(guildId);
  const updateConfig = useUpdateXpConfig(guildId);
  const { data: multipliers = [] } = useChannelMultipliers(guildId);
  const removeMultiplier = useRemoveChannelMultiplier(guildId);

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
        label="XP System"
        description="Enable or disable XP and leveling"
        disabled={updateConfig.isPending}
      />

      <ConfigSection title="XP Settings" description="Configure XP gain rates">
        <Slider
          value={config.minXpPerMessage}
          onChange={(v) => updateConfig.mutate({ minXpPerMessage: v })}
          min={1}
          max={50}
          label="Min XP per Message"
        />
        <Slider
          value={config.maxXpPerMessage}
          onChange={(v) => updateConfig.mutate({ maxXpPerMessage: v })}
          min={1}
          max={100}
          label="Max XP per Message"
        />
        <Slider
          value={config.cooldownSeconds}
          onChange={(v) => updateConfig.mutate({ cooldownSeconds: v })}
          min={0}
          max={300}
          step={5}
          label="Cooldown"
          valueFormat={(v) => `${v}s`}
        />
      </ConfigSection>

      <ConfigSection
        title="Voice XP"
        description="XP earned from voice channels"
      >
        <StatusToggle
          enabled={config.voiceXpEnabled}
          onChange={(enabled) =>
            updateConfig.mutate({ voiceXpEnabled: enabled })
          }
          label="Voice XP"
          description="Award XP for time spent in voice channels"
        />
        {config.voiceXpEnabled && (
          <Slider
            value={config.xpPerVoiceMinute}
            onChange={(v) => updateConfig.mutate({ xpPerVoiceMinute: v })}
            min={1}
            max={20}
            label="XP per Voice Minute"
          />
        )}
      </ConfigSection>

      <ConfigSection title="Level-Up Notifications">
        <ChannelPicker
          guildId={guildId}
          value={config.levelUpChannelId}
          onChange={(channelId) =>
            updateConfig.mutate({ levelUpChannelId: channelId })
          }
          filter="text"
          label="Level-Up Channel"
          placeholder="Same channel as message"
          clearable
        />
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Level-Up Message Template
          </label>
          <textarea
            value={config.levelUpMessage ?? ""}
            onChange={(e) =>
              updateConfig.mutate({ levelUpMessage: e.target.value || null })
            }
            placeholder="Congrats {user}, you reached level {level}!"
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Placeholders: {"{user}"}, {"{level}"}, {"{xp}"}
          </p>
        </div>
      </ConfigSection>

      <ConfigSection title="Multipliers">
        <StatusToggle
          enabled={config.stackMultipliers}
          onChange={(enabled) =>
            updateConfig.mutate({ stackMultipliers: enabled })
          }
          label="Stack Multipliers"
          description="Stack channel multipliers instead of using highest"
        />

        <div>
          <h3 className="text-sm font-medium mb-2">Channel Multipliers</h3>
          {multipliers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No channel multipliers configured.
            </p>
          ) : (
            <div className="space-y-2">
              {multipliers.map((m) => (
                <div
                  key={m.channelId}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-sm">#{m.channelName}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{m.multiplier}x</Badge>
                    <button
                      type="button"
                      onClick={() => removeMultiplier.mutate(m.channelId)}
                      className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                      aria-label="Remove multiplier"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ConfigSection>

      <ConfigSection title="Ignored Channels">
        <p className="text-sm text-muted-foreground">
          {config.ignoredChannelIds.length === 0
            ? "No channels are being ignored."
            : `${config.ignoredChannelIds.length} channel(s) ignored from XP gain.`}
        </p>
      </ConfigSection>
    </div>
  );
}

// --- Rewards Tab ---

function XpRewardsTab({ guildId }: { guildId: string }) {
  const { data: rewards = [], isLoading } = useRoleRewards(guildId);
  const addReward = useAddRoleReward(guildId);
  const deleteReward = useDeleteRoleReward(guildId);
  const [newLevel, setNewLevel] = useState("");
  const [newRoleId, setNewRoleId] = useState<string | null>(null);
  const [removeOnDelevel, setRemoveOnDelevel] = useState(false);

  const handleAdd = useCallback(() => {
    const level = Number.parseInt(newLevel, 10);
    if (!level || level < 1 || level > 500 || !newRoleId) return;
    addReward.mutate(
      { level, roleId: newRoleId, removeOnDelevel },
      {
        onSuccess: () => {
          setNewLevel("");
          setNewRoleId(null);
          setRemoveOnDelevel(false);
        },
      }
    );
  }, [newLevel, newRoleId, removeOnDelevel, addReward]);

  const columns: Column<RoleReward>[] = [
    { key: "level", header: "Level" },
    { key: "roleName", header: "Role" },
    {
      key: "removeOnDelevel",
      header: "Remove on Delevel",
      render: (r) => (r.removeOnDelevel ? "Yes" : "No"),
    },
  ];

  return (
    <div className="space-y-6">
      <ConfigSection title="Add Role Reward">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Level</label>
            <input
              type="number"
              min={1}
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              placeholder="e.g. 5"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <RolePicker
            guildId={guildId}
            value={newRoleId}
            onChange={(v) => setNewRoleId(typeof v === "string" ? v : null)}
            label="Role"
            placeholder="Select role"
          />
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeOnDelevel}
                onChange={(e) => setRemoveOnDelevel(e.target.checked)}
                className="rounded border-border"
              />
              Remove on delevel
            </label>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!newLevel || !newRoleId || addReward.isPending}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Reward
        </Button>
      </ConfigSection>

      <DataTable
        data={rewards}
        columns={columns}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        emptyState={{
          title: "No role rewards",
          description: "Add role rewards to grant roles at specific levels",
          icon: Award,
        }}
        rowActions={(row) => [
          {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: () => deleteReward.mutate(row.id),
          },
        ]}
      />
    </div>
  );
}

// --- Leaderboard Tab ---

function XpLeaderboardTab({ guildId }: { guildId: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useXpLeaderboard(guildId, page, search);

  const columns: Column<LeaderboardEntry>[] = [
    { key: "rank", header: "#", width: "50px" },
    { key: "username", header: "User" },
    { key: "level", header: "Level", width: "80px" },
    {
      key: "xp",
      header: "XP",
      render: (r) => r.xp.toLocaleString(),
    },
    {
      key: "messages",
      header: "Messages",
      render: (r) => r.messages.toLocaleString(),
    },
    {
      key: "voiceMinutes",
      header: "Voice",
      render: (r) => `${Math.round(r.voiceMinutes / 60)}h`,
      width: "80px",
    },
  ];

  return (
    <DataTable
      data={data?.data ?? []}
      columns={columns}
      isLoading={isLoading}
      pagination={data?.pagination}
      onPageChange={setPage}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search users..."
      getRowKey={(r) => r.userId}
      emptyState={{
        title: "No leaderboard data",
        description: "Members will appear here as they earn XP",
        icon: BarChart3,
      }}
    />
  );
}

// --- Import Tab ---

function XpImportTab({ guildId }: { guildId: string }) {
  const { data: history = [], isLoading } = useXpImportHistory(guildId);
  const importMee6 = useImportMee6(guildId);

  const columns: Column<XpImportResult>[] = [
    { key: "source", header: "Source" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge
          variant={
            r.status === "completed"
              ? "default"
              : r.status === "running"
              ? "secondary"
              : "error"
          }
        >
          {r.status}
        </Badge>
      ),
    },
    { key: "imported", header: "Imported" },
    { key: "skipped", header: "Skipped" },
    { key: "failed", header: "Failed" },
    {
      key: "createdAt",
      header: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <ConfigSection
        title="Import from MEE6"
        description="Import existing XP data from MEE6"
      >
        <Button
          onClick={() => importMee6.mutate({})}
          disabled={importMee6.isPending}
        >
          <Download className="h-4 w-4 mr-1" />
          {importMee6.isPending ? "Importing..." : "Start MEE6 Import"}
        </Button>
      </ConfigSection>

      <ConfigSection title="Import History">
        <DataTable
          data={history}
          columns={columns}
          isLoading={isLoading}
          getRowKey={(r) => r.id}
          emptyState={{
            title: "No imports yet",
            description: "Import history will appear here",
            icon: Download,
          }}
        />
      </ConfigSection>
    </div>
  );
}

// --- Page ---

export function XpPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("XP & Reputation");

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
        title="XP & Reputation"
        description="Configure experience points, leveling, and role rewards"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "config" && <XpConfigTab guildId={guildId} />}
        {activeTab === "rewards" && <XpRewardsTab guildId={guildId} />}
        {activeTab === "leaderboard" && <XpLeaderboardTab guildId={guildId} />}
        {activeTab === "import" && <XpImportTab guildId={guildId} />}
      </div>
    </FadeIn>
  );
}
