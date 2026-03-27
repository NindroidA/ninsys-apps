import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { SkeletonConfigTab } from "@/components/ui/LoadingSkeleton";
import { useTicketConfig, useUpdateTicketConfig } from "@/hooks/useTickets";
import { deepEqual } from "@/lib/utils";
import type { TicketConfig } from "@/types/tickets";
import { Card } from "@ninsys/ui/components";
import { Timer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TicketConfigTabProps {
  guildId: string;
}

type ConfigFormState = Pick<
  TicketConfig,
  | "channelId"
  | "categoryId"
  | "archiveForumId"
  | "adminOnlyMentionStaff"
  | "pingStaffOn18Verify"
  | "pingStaffOnBanAppeal"
>;

const DEFAULT_STATE: ConfigFormState = {
  channelId: null,
  categoryId: null,
  archiveForumId: null,
  adminOnlyMentionStaff: false,
  pingStaffOn18Verify: false,
  pingStaffOnBanAppeal: false,
};

export function TicketConfigTab({ guildId }: TicketConfigTabProps) {
  const { data: config, isLoading } = useTicketConfig(guildId);
  const updateConfig = useUpdateTicketConfig(guildId);

  const [form, setForm] = useState<ConfigFormState>(DEFAULT_STATE);
  const [original, setOriginal] = useState<ConfigFormState>(DEFAULT_STATE);

  useEffect(() => {
    if (config) {
      const state: ConfigFormState = {
        channelId: config.channelId,
        categoryId: config.categoryId,
        archiveForumId: config.archiveForumId,
        adminOnlyMentionStaff: config.adminOnlyMentionStaff,
        pingStaffOn18Verify: config.pingStaffOn18Verify,
        pingStaffOnBanAppeal: config.pingStaffOnBanAppeal,
      };
      setForm(state);
      setOriginal(state);
    }
  }, [config]);

  const isDirty = !deepEqual(form, original);

  const handleSave = useCallback(() => {
    updateConfig.mutate(form, {
      onSuccess: () => setOriginal(form),
    });
  }, [form, updateConfig]);

  const handleDiscard = useCallback(() => {
    setForm(original);
  }, [original]);

  if (isLoading) return <SkeletonConfigTab />;

  return (
    <div className="space-y-6">
      <ConfigSection
        title="Channel Settings"
        description="Configure where tickets are created and archived"
      >
        <ChannelPicker
          guildId={guildId}
          value={form.channelId}
          onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
          filter="text"
          label="Ticket Channel"
          placeholder="Select ticket channel"
          clearable
          disabled={updateConfig.isPending}
        />
        <ChannelPicker
          guildId={guildId}
          value={form.categoryId}
          onChange={(categoryId) =>
            setForm((prev) => ({ ...prev, categoryId }))
          }
          filter="category"
          label="Ticket Category"
          placeholder="Select ticket category"
          clearable
          disabled={updateConfig.isPending}
        />
        <ChannelPicker
          guildId={guildId}
          value={form.archiveForumId}
          onChange={(archiveForumId) =>
            setForm((prev) => ({ ...prev, archiveForumId }))
          }
          filter="forum"
          label="Archive Forum"
          placeholder="Select archive forum"
          clearable
          disabled={updateConfig.isPending}
        />
      </ConfigSection>

      <ConfigSection
        title="Staff Notifications"
        description="Configure when staff members are notified"
      >
        <StatusToggle
          enabled={form.adminOnlyMentionStaff}
          onChange={(adminOnlyMentionStaff) =>
            setForm((prev) => ({ ...prev, adminOnlyMentionStaff }))
          }
          label="Admin-Only Staff Mentions"
          description="Only admins can @mention staff in tickets"
          disabled={updateConfig.isPending}
        />
        <StatusToggle
          enabled={form.pingStaffOn18Verify}
          onChange={(pingStaffOn18Verify) =>
            setForm((prev) => ({ ...prev, pingStaffOn18Verify }))
          }
          label="Ping on 18+ Verification"
          description="Ping staff when a user opens a 18+ verification ticket"
          disabled={updateConfig.isPending}
        />
        <StatusToggle
          enabled={form.pingStaffOnBanAppeal}
          onChange={(pingStaffOnBanAppeal) =>
            setForm((prev) => ({ ...prev, pingStaffOnBanAppeal }))
          }
          label="Ping on Ban Appeals"
          description="Ping staff when a user opens a ban appeal ticket"
          disabled={updateConfig.isPending}
        />
      </ConfigSection>

      {/* Workflow Management */}
      {config && (
        <ConfigSection
          title="Workflow"
          description="Configure ticket statuses and auto-close behavior"
        >
          <StatusToggle
            enabled={config.enableWorkflow ?? false}
            onChange={(enableWorkflow) => {
              updateConfig.mutate({ enableWorkflow });
            }}
            label="Enable Workflow"
            description="Use custom statuses for ticket lifecycle management"
            disabled={updateConfig.isPending}
          />

          {config.enableWorkflow && (
            <div className="space-y-4 pt-2">
              {/* Current statuses */}
              <div>
                <p className="text-sm font-medium mb-2">Workflow Statuses</p>
                {(config.workflowStatuses ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(config.workflowStatuses ?? []).map((ws) => (
                      <span
                        key={ws.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border text-sm"
                      >
                        <span>{ws.emoji}</span>
                        <span style={{ color: ws.color }}>{ws.label}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No custom statuses configured. Default statuses (Open, In
                    Progress, Awaiting Response, Resolved, Closed) will be used.
                  </p>
                )}
              </div>

              {/* Auto-close settings */}
              <div className="space-y-3 pt-2 border-t border-border">
                <StatusToggle
                  enabled={config.autoCloseEnabled ?? false}
                  onChange={(autoCloseEnabled) => {
                    updateConfig.mutate({ autoCloseEnabled });
                  }}
                  label="Auto-Close"
                  description="Automatically close inactive tickets"
                  disabled={updateConfig.isPending}
                />

                {config.autoCloseEnabled && (
                  <Card className="p-3 flex items-start gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium">Auto-close:</span>{" "}
                      <span className="text-muted-foreground">
                        {config.autoCloseDays ?? 7} day
                        {(config.autoCloseDays ?? 7) !== 1 ? "s" : ""}{" "}
                        inactivity
                        {config.autoCloseStatus &&
                          ` in "${config.autoCloseStatus}" status`}
                        {config.autoCloseWarningHours &&
                          ` (${config.autoCloseWarningHours}h warning)`}
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </ConfigSection>
      )}

      <SaveBar
        isDirty={isDirty}
        isLoading={updateConfig.isPending}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
