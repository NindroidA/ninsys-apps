import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import {
  useBaitChannelConfig,
  useUpdateBaitChannelConfig,
} from "@/hooks/useBaitChannel";
import { deepEqual } from "@/lib/utils";
import type { BaitChannelAction } from "@/types/bait-channel";
import { Input } from "@ninsys/ui/components";
import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

interface BaitConfigTabProps {
  guildId: string;
}

interface ConfigFormState {
  channelId: string | null;
  logChannelId: string | null;
  actionType: BaitChannelAction;
  gracePeriodSeconds: number;
  enableSmartDetection: boolean;
  instantActionThreshold: number;
  minAccountAgeDays: number;
  minMembershipMinutes: number;
  minMessageCount: number;
  requireVerification: boolean;
  banReason: string | null;
  warningMessage: string | null;
  deleteUserMessages: boolean;
  deleteMessageDays: number;
  // v3.0
  testMode: boolean;
  escalationEnabled: boolean;
  escalationLogThreshold: number;
  escalationTimeoutThreshold: number;
  escalationKickThreshold: number;
  escalationBanThreshold: number;
  weeklySummaryEnabled: boolean;
  weeklySummaryChannelId: string | null;
  dmNotificationsEnabled: boolean;
  appealInfo: string | null;
  additionalChannelIds: string[];
}

const DEFAULT_STATE: ConfigFormState = {
  channelId: null,
  logChannelId: null,
  actionType: "ban",
  gracePeriodSeconds: 0,
  enableSmartDetection: false,
  instantActionThreshold: 50,
  minAccountAgeDays: 0,
  minMembershipMinutes: 0,
  minMessageCount: 0,
  requireVerification: false,
  banReason: null,
  warningMessage: null,
  deleteUserMessages: false,
  deleteMessageDays: 0,
  testMode: false,
  escalationEnabled: false,
  escalationLogThreshold: 30,
  escalationTimeoutThreshold: 50,
  escalationKickThreshold: 75,
  escalationBanThreshold: 90,
  weeklySummaryEnabled: false,
  weeklySummaryChannelId: null,
  dmNotificationsEnabled: false,
  appealInfo: null,
  additionalChannelIds: [],
};

const ACTION_OPTIONS = [
  { value: "ban", label: "Ban", description: "Permanently ban the user" },
  { value: "kick", label: "Kick", description: "Remove user from server" },
  { value: "mute", label: "Mute", description: "Timeout the user" },
  { value: "warn", label: "Warn", description: "Send a warning to the user" },
] as const;

const MAX_CHANNELS = 3;

function formatGracePeriod(seconds: number): string {
  if (seconds === 0) return "Instant";
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (remainingSecs === 0)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  return `${minutes}m ${remainingSecs}s`;
}

function EscalationBar({
  log,
  timeout,
  kick,
  ban,
}: {
  log: number;
  timeout: number;
  kick: number;
  ban: number;
}) {
  return (
    <div className="relative h-6 rounded-full overflow-hidden bg-muted mt-3 mb-1">
      <div
        className="absolute inset-y-0 left-0 bg-blue-500/30"
        style={{ width: `${log}%` }}
      />
      <div
        className="absolute inset-y-0 bg-yellow-500/30"
        style={{ left: `${log}%`, width: `${timeout - log}%` }}
      />
      <div
        className="absolute inset-y-0 bg-orange-500/30"
        style={{ left: `${timeout}%`, width: `${kick - timeout}%` }}
      />
      <div
        className="absolute inset-y-0 bg-red-500/30"
        style={{ left: `${kick}%`, width: `${ban - kick}%` }}
      />
      <div
        className="absolute inset-y-0 bg-red-600/40"
        style={{ left: `${ban}%`, width: `${100 - ban}%` }}
      />
      {/* Labels */}
      <span
        className="absolute top-0.5 text-[9px] font-medium text-blue-400"
        style={{ left: `${Math.max(log / 2 - 2, 1)}%` }}
      >
        Log
      </span>
      <span
        className="absolute top-0.5 text-[9px] font-medium text-yellow-400"
        style={{ left: `${log + (timeout - log) / 2 - 3}%` }}
      >
        Timeout
      </span>
      <span
        className="absolute top-0.5 text-[9px] font-medium text-orange-400"
        style={{ left: `${timeout + (kick - timeout) / 2 - 2}%` }}
      >
        Kick
      </span>
      <span
        className="absolute top-0.5 text-[9px] font-medium text-red-400"
        style={{ left: `${kick + (ban - kick) / 2 - 2}%` }}
      >
        Ban
      </span>
    </div>
  );
}

function SkeletonConfig() {
  return (
    <div className="space-y-6 animate-pulse max-w-3xl">
      <div className="rounded-xl border border-border bg-card overflow-visible">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-5 w-40 rounded bg-muted" />
        </div>
        <div className="p-6 space-y-4">
          <div className="h-10 rounded-lg bg-muted" />
          <div className="h-10 rounded-lg bg-muted" />
          <div className="h-10 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function BaitConfigTab({ guildId }: BaitConfigTabProps) {
  const { data: config, isLoading } = useBaitChannelConfig(guildId);
  const updateConfig = useUpdateBaitChannelConfig(guildId);

  const [form, setForm] = useState<ConfigFormState>(DEFAULT_STATE);
  const [original, setOriginal] = useState<ConfigFormState>(DEFAULT_STATE);
  const [removeChannelTarget, setRemoveChannelTarget] = useState<string | null>(
    null
  );

  const banReasonId = useId();
  const warningMsgId = useId();
  const minAccountAgeId = useId();
  const minMembershipId = useId();
  const minMsgCountId = useId();
  const appealInfoId = useId();

  useEffect(() => {
    if (config) {
      const state: ConfigFormState = {
        channelId: config.channelId,
        logChannelId: config.logChannelId,
        actionType: config.actionType,
        gracePeriodSeconds: config.gracePeriodSeconds,
        enableSmartDetection: config.enableSmartDetection,
        instantActionThreshold: config.instantActionThreshold,
        minAccountAgeDays: config.minAccountAgeDays,
        minMembershipMinutes: config.minMembershipMinutes,
        minMessageCount: config.minMessageCount,
        requireVerification: config.requireVerification,
        banReason: config.banReason,
        warningMessage: config.warningMessage,
        deleteUserMessages: config.deleteUserMessages,
        deleteMessageDays: config.deleteMessageDays,
        testMode: config.testMode ?? false,
        escalationEnabled: config.escalationEnabled ?? false,
        escalationLogThreshold: config.escalationLogThreshold ?? 30,
        escalationTimeoutThreshold: config.escalationTimeoutThreshold ?? 50,
        escalationKickThreshold: config.escalationKickThreshold ?? 75,
        escalationBanThreshold: config.escalationBanThreshold ?? 90,
        weeklySummaryEnabled: config.weeklySummaryEnabled ?? false,
        weeklySummaryChannelId: config.weeklySummaryChannelId ?? null,
        dmNotificationsEnabled: config.dmNotificationsEnabled ?? false,
        appealInfo: config.appealInfo ?? null,
        additionalChannelIds: config.additionalChannelIds ?? [],
      };
      setForm(state);
      setOriginal(state);
    }
  }, [config]);

  const isDirty = !deepEqual(form, original);

  const escalationError =
    form.escalationEnabled &&
    !(
      form.escalationLogThreshold < form.escalationTimeoutThreshold &&
      form.escalationTimeoutThreshold < form.escalationKickThreshold &&
      form.escalationKickThreshold < form.escalationBanThreshold
    )
      ? "Thresholds must be strictly ascending: Log < Timeout < Kick < Ban"
      : null;

  const handleSave = useCallback(() => {
    if (escalationError) return;
    updateConfig.mutate(form, {
      onSuccess: () => setOriginal(form),
    });
  }, [form, updateConfig, escalationError]);

  const handleDiscard = useCallback(() => {
    setForm(original);
  }, [original]);

  const handleAddChannel = useCallback(
    (channelId: string | null) => {
      if (!channelId || form.additionalChannelIds.includes(channelId)) return;
      setForm((prev) => ({
        ...prev,
        additionalChannelIds: [...prev.additionalChannelIds, channelId],
      }));
    },
    [form.additionalChannelIds]
  );

  const handleRemoveChannel = useCallback(() => {
    if (!removeChannelTarget) return;
    setForm((prev) => ({
      ...prev,
      additionalChannelIds: prev.additionalChannelIds.filter(
        (id) => id !== removeChannelTarget
      ),
    }));
    setRemoveChannelTarget(null);
  }, [removeChannelTarget]);

  if (isLoading) return <SkeletonConfig />;

  return (
    <div className="space-y-6">
      {/* Test Mode Warning */}
      {form.testMode && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              Test Mode Active
            </p>
            <p className="text-xs text-amber-300/70 mt-0.5">
              The bot will log detections but will NOT ban, kick, or timeout
              users. Use this to tune thresholds before going live.
            </p>
          </div>
        </div>
      )}

      {/* Basic Settings */}
      <ConfigSection
        title="Basic Settings"
        description="Configure the bait channel and logging"
      >
        <ChannelPicker
          guildId={guildId}
          value={form.channelId}
          onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
          filter="text"
          label="Primary Bait Channel"
          placeholder="Select the honeypot channel"
          clearable
          disabled={updateConfig.isPending}
        />
        <ChannelPicker
          guildId={guildId}
          value={form.logChannelId}
          onChange={(logChannelId) =>
            setForm((prev) => ({ ...prev, logChannelId }))
          }
          filter="text"
          label="Log Channel"
          placeholder="Select where detections are logged"
          clearable
          disabled={updateConfig.isPending}
        />
        <Select
          value={form.actionType}
          onChange={(v) =>
            setForm((prev) => ({
              ...prev,
              actionType: v as ConfigFormState["actionType"],
            }))
          }
          options={ACTION_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
            description: opt.description,
          }))}
          label="Default Action"
          disabled={updateConfig.isPending}
        />
        <Slider
          value={form.gracePeriodSeconds}
          onChange={(gracePeriodSeconds) =>
            setForm((prev) => ({ ...prev, gracePeriodSeconds }))
          }
          min={0}
          max={300}
          step={5}
          label="Grace Period"
          valueFormat={formatGracePeriod}
          disabled={updateConfig.isPending}
        />
      </ConfigSection>

      {/* Test Mode */}
      <ConfigSection
        title="Test Mode"
        description="Safely test detection without taking action"
      >
        <StatusToggle
          enabled={form.testMode}
          onChange={(testMode) => setForm((prev) => ({ ...prev, testMode }))}
          label="Enable Test Mode"
          description="Log detections only — no bans, kicks, or timeouts"
          disabled={updateConfig.isPending}
        />
      </ConfigSection>

      {/* Escalation Thresholds */}
      <ConfigSection
        title="Escalation Thresholds"
        description="Score-based graduated response (overrides default action when enabled)"
      >
        <StatusToggle
          enabled={form.escalationEnabled}
          onChange={(escalationEnabled) =>
            setForm((prev) => ({ ...prev, escalationEnabled }))
          }
          label="Enable Graduated Escalation"
          description="Use score thresholds to determine action severity"
          disabled={updateConfig.isPending}
        />

        {form.escalationEnabled && (
          <div className="space-y-4 pt-2">
            <Slider
              value={form.escalationLogThreshold}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, escalationLogThreshold: v }))
              }
              min={0}
              max={100}
              step={5}
              label="Log Threshold"
              valueFormat={(v) => `${v}`}
              disabled={updateConfig.isPending}
            />
            <Slider
              value={form.escalationTimeoutThreshold}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, escalationTimeoutThreshold: v }))
              }
              min={0}
              max={100}
              step={5}
              label="Timeout Threshold"
              valueFormat={(v) => `${v}`}
              disabled={updateConfig.isPending}
            />
            <Slider
              value={form.escalationKickThreshold}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, escalationKickThreshold: v }))
              }
              min={0}
              max={100}
              step={5}
              label="Kick Threshold"
              valueFormat={(v) => `${v}`}
              disabled={updateConfig.isPending}
            />
            <Slider
              value={form.escalationBanThreshold}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, escalationBanThreshold: v }))
              }
              min={0}
              max={100}
              step={5}
              label="Ban Threshold"
              valueFormat={(v) => `${v}`}
              disabled={updateConfig.isPending}
            />

            <EscalationBar
              log={form.escalationLogThreshold}
              timeout={form.escalationTimeoutThreshold}
              kick={form.escalationKickThreshold}
              ban={form.escalationBanThreshold}
            />

            {escalationError && (
              <p className="text-xs text-destructive">{escalationError}</p>
            )}
          </div>
        )}
      </ConfigSection>

      {/* Multi-Channel */}
      <ConfigSection
        title="Additional Bait Channels"
        description={`Monitor up to ${MAX_CHANNELS} channels total (primary + ${
          MAX_CHANNELS - 1
        } additional)`}
      >
        <div className="space-y-2">
          {form.additionalChannelIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No additional channels configured
            </p>
          ) : (
            form.additionalChannelIds.map((chId) => (
              <div
                key={chId}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm font-mono text-muted-foreground">
                  {chId}
                </span>
                <button
                  type="button"
                  onClick={() => setRemoveChannelTarget(chId)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Remove channel"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
          {form.additionalChannelIds.length < MAX_CHANNELS - 1 && (
            <ChannelPicker
              guildId={guildId}
              value={null}
              onChange={handleAddChannel}
              filter="text"
              placeholder="Add another bait channel..."
              disabled={updateConfig.isPending}
            />
          )}
        </div>
      </ConfigSection>

      {/* Smart Detection */}
      <ConfigSection
        title="Smart Detection"
        description="Advanced detection with suspicion scoring"
      >
        <StatusToggle
          enabled={form.enableSmartDetection}
          onChange={(enableSmartDetection) =>
            setForm((prev) => ({ ...prev, enableSmartDetection }))
          }
          label="Enable Smart Detection"
          description="Use suspicion scoring instead of simple detection"
          disabled={updateConfig.isPending}
        />

        {form.enableSmartDetection && (
          <div className="space-y-4 pt-2">
            <Slider
              value={form.instantActionThreshold}
              onChange={(instantActionThreshold) =>
                setForm((prev) => ({ ...prev, instantActionThreshold }))
              }
              min={0}
              max={100}
              step={5}
              label="Suspicion Threshold"
              valueFormat={(v) => `${v}%`}
              disabled={updateConfig.isPending}
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Lower = more aggressive, Higher = more lenient
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor={minAccountAgeId}
                  className="text-sm font-medium mb-1.5 block"
                >
                  Min Account Age (days)
                </label>
                <Input
                  id={minAccountAgeId}
                  type="number"
                  min={0}
                  value={form.minAccountAgeDays}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minAccountAgeDays: Math.max(
                        0,
                        Number(e.target.value) || 0
                      ),
                    }))
                  }
                  disabled={updateConfig.isPending}
                />
              </div>
              <div>
                <label
                  htmlFor={minMembershipId}
                  className="text-sm font-medium mb-1.5 block"
                >
                  Min Membership (minutes)
                </label>
                <Input
                  id={minMembershipId}
                  type="number"
                  min={0}
                  value={form.minMembershipMinutes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minMembershipMinutes: Math.max(
                        0,
                        Number(e.target.value) || 0
                      ),
                    }))
                  }
                  disabled={updateConfig.isPending}
                />
              </div>
              <div>
                <label
                  htmlFor={minMsgCountId}
                  className="text-sm font-medium mb-1.5 block"
                >
                  Min Message Count
                </label>
                <Input
                  id={minMsgCountId}
                  type="number"
                  min={0}
                  value={form.minMessageCount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minMessageCount: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  disabled={updateConfig.isPending}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requireVerification}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requireVerification: e.target.checked,
                  }))
                }
                disabled={updateConfig.isPending}
                className="rounded"
              />
              <span className="text-sm">Require Verification</span>
            </label>
          </div>
        )}
      </ConfigSection>

      {/* DM Notifications */}
      <ConfigSection
        title="DM Notifications"
        description="Send users a DM before action is taken"
      >
        <StatusToggle
          enabled={form.dmNotificationsEnabled}
          onChange={(dmNotificationsEnabled) =>
            setForm((prev) => ({ ...prev, dmNotificationsEnabled }))
          }
          label="Enable DM Notifications"
          description="Notify users via DM before banning/kicking"
          disabled={updateConfig.isPending}
        />

        {form.dmNotificationsEnabled && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={appealInfoId} className="text-sm font-medium">
                Appeal Information
              </label>
              <span className="text-xs text-muted-foreground">
                {(form.appealInfo ?? "").length}/500
              </span>
            </div>
            <EmojiTextarea
              id={appealInfoId}
              value={form.appealInfo ?? ""}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  appealInfo: v.slice(0, 500) || null,
                }))
              }
              placeholder="How to appeal (e.g., link to appeal form, contact info)..."
              rows={3}
              maxLength={500}
              disabled={updateConfig.isPending}
            />
          </div>
        )}
      </ConfigSection>

      {/* Weekly Summary */}
      <ConfigSection
        title="Weekly Summary"
        description="Automated analytics digest"
      >
        <StatusToggle
          enabled={form.weeklySummaryEnabled}
          onChange={(weeklySummaryEnabled) =>
            setForm((prev) => ({ ...prev, weeklySummaryEnabled }))
          }
          label="Enable Weekly Summary"
          description="Post a detection summary every Sunday at 00:00 UTC"
          disabled={updateConfig.isPending}
        />

        {form.weeklySummaryEnabled && (
          <ChannelPicker
            guildId={guildId}
            value={form.weeklySummaryChannelId}
            onChange={(weeklySummaryChannelId) =>
              setForm((prev) => ({ ...prev, weeklySummaryChannelId }))
            }
            filter="text"
            label="Summary Channel"
            placeholder="Defaults to log channel if not set"
            clearable
            disabled={updateConfig.isPending}
          />
        )}
      </ConfigSection>

      {/* Action Settings */}
      <ConfigSection
        title="Action Settings"
        description="Configure messages and behavior on detection"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={banReasonId} className="text-sm font-medium">
              Ban Reason
            </label>
            {form.banReason !== null && (
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, banReason: null }))
                }
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
          <EmojiTextarea
            id={banReasonId}
            value={form.banReason ?? ""}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, banReason: v || null }))
            }
            placeholder="Triggered bait channel detection"
            rows={2}
            disabled={updateConfig.isPending}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={warningMsgId} className="text-sm font-medium">
              Warning Message
            </label>
            {form.warningMessage !== null && (
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, warningMessage: null }))
                }
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
          <EmojiTextarea
            id={warningMsgId}
            value={form.warningMessage ?? ""}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, warningMessage: v || null }))
            }
            placeholder="You have been flagged by our automated detection system..."
            rows={3}
            disabled={updateConfig.isPending}
          />
        </div>

        <StatusToggle
          enabled={form.deleteUserMessages}
          onChange={(deleteUserMessages) =>
            setForm((prev) => ({ ...prev, deleteUserMessages }))
          }
          label="Delete Messages"
          description="Delete the user's recent messages on action"
          disabled={updateConfig.isPending}
        />

        {form.deleteUserMessages && (
          <Slider
            value={form.deleteMessageDays}
            onChange={(deleteMessageDays) =>
              setForm((prev) => ({ ...prev, deleteMessageDays }))
            }
            min={0}
            max={7}
            step={1}
            label="Delete Message History"
            valueFormat={(v) =>
              v === 0 ? "None" : `${v} day${v !== 1 ? "s" : ""}`
            }
            disabled={updateConfig.isPending}
          />
        )}
      </ConfigSection>

      <SaveBar
        isDirty={isDirty && !escalationError}
        isLoading={updateConfig.isPending}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Remove channel confirmation */}
      <ConfirmDialog
        open={removeChannelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveChannelTarget(null);
        }}
        title="Remove Channel"
        description="Remove this channel from bait channel monitoring?"
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleRemoveChannel}
      />
    </div>
  );
}
