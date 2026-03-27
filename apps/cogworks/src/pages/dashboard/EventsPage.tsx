import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { Tabs } from "@/components/ui/Tabs";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useEventsConfig,
  useUpdateEventsConfig,
  useEventTemplates,
  useDeleteEventTemplate,
  useUpcomingReminders,
} from "@/hooks/useEvents";
import type { UpcomingReminder } from "@/types/events";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Badge, Card } from "@ninsys/ui/components";
import { Bell, Clock, LayoutTemplate, Settings, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const TABS = [
  { id: "config", label: "Config", icon: Settings },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "reminders", label: "Reminders", icon: Bell },
];

function TabFallback() {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

// --- Config Tab ---

function EventsConfigTab({ guildId }: { guildId: string }) {
  const { data: config, isLoading } = useEventsConfig(guildId);
  const updateConfig = useUpdateEventsConfig(guildId);

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
        label="Scheduled Events"
        description="Enable event reminders and management"
        disabled={updateConfig.isPending}
      />

      <ConfigSection title="Reminder Settings">
        <ChannelPicker
          guildId={guildId}
          value={config.reminderChannelId}
          onChange={(channelId) =>
            updateConfig.mutate({ reminderChannelId: channelId })
          }
          filter="text"
          label="Reminder Channel"
          placeholder="Select reminder channel"
          clearable
        />

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Default Reminder (minutes before)
          </label>
          <input
            type="number"
            min={1}
            max={1440}
            value={config.defaultReminderMinutes}
            onChange={(e) =>
              updateConfig.mutate({
                defaultReminderMinutes:
                  Number.parseInt(e.target.value, 10) || 15,
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </div>
      </ConfigSection>

      <ConfigSection title="Post-Event Summary">
        <StatusToggle
          enabled={config.postEventSummary}
          onChange={(postEventSummary) =>
            updateConfig.mutate({ postEventSummary })
          }
          label="Post-Event Summary"
          description="Automatically post a summary after events end"
        />
        {config.postEventSummary && (
          <ChannelPicker
            guildId={guildId}
            value={config.summaryChannelId}
            onChange={(channelId) =>
              updateConfig.mutate({ summaryChannelId: channelId })
            }
            filter="text"
            label="Summary Channel"
            placeholder="Select summary channel"
            clearable
          />
        )}
      </ConfigSection>
    </div>
  );
}

// --- Templates Tab ---

function EventTemplatesTab({ guildId }: { guildId: string }) {
  const { data: templates = [], isLoading } = useEventTemplates(guildId);
  const deleteTemplate = useDeleteEventTemplate(guildId);

  if (isLoading) return <TabFallback />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
          configured
        </p>
      </div>

      {templates.length === 0 ? (
        <Card className="py-12 text-center">
          <LayoutTemplate className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-medium">No event templates</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create templates to quickly set up recurring events
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {template.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTemplate.mutate(template.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0 ml-2"
                  aria-label="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{template.entityType}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {template.durationMinutes}min
                </span>
                {template.recurring && (
                  <Badge variant="default">Recurring</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Reminders Tab ---

function EventRemindersTab({ guildId }: { guildId: string }) {
  const { data: reminders = [], isLoading } = useUpcomingReminders(guildId);

  const columns: Column<UpcomingReminder>[] = [
    { key: "eventName", header: "Event" },
    {
      key: "reminderTime",
      header: "Reminder At",
      render: (r) => new Date(r.reminderTime).toLocaleString(),
    },
    {
      key: "sent",
      header: "Status",
      render: (r) => (
        <Badge variant={r.sent ? "default" : "secondary"}>
          {r.sent ? "Sent" : "Pending"}
        </Badge>
      ),
      width: "100px",
    },
  ];

  return (
    <DataTable
      data={reminders}
      columns={columns}
      isLoading={isLoading}
      getRowKey={(r) => r.id}
      emptyState={{
        title: "No upcoming reminders",
        description: "Reminders for scheduled events will appear here",
        icon: Bell,
      }}
    />
  );
}

// --- Page ---

export function EventsPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("Scheduled Events");

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
        title="Scheduled Events"
        description="Manage event reminders, templates, and summaries"
      />

      <div className="space-y-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "config" && <EventsConfigTab guildId={guildId} />}
        {activeTab === "templates" && <EventTemplatesTab guildId={guildId} />}
        {activeTab === "reminders" && <EventRemindersTab guildId={guildId} />}
      </div>
    </FadeIn>
  );
}
