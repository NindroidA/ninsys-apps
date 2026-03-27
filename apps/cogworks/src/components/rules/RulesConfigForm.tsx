import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import type { RulesConfig } from "@/types/rules";
import { Button } from "@ninsys/ui/components";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { useId } from "react";

export const MAX_RULES_TEXT = 2000;

export interface RulesFormState {
  channelId: string | null;
  roleId: string | null;
  emoji: string | null;
  customText: string | null;
}

export const DEFAULT_STATE: RulesFormState = {
  channelId: null,
  roleId: null,
  emoji: null,
  customText: null,
};

export function SkeletonRulesPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-full rounded-xl bg-muted" />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-5 w-40 rounded bg-muted" />
        </div>
        <div className="p-6 space-y-4">
          <div className="h-10 rounded-lg bg-muted" />
          <div className="h-10 rounded-lg bg-muted" />
          <div className="h-10 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-5 w-48 rounded bg-muted" />
        </div>
        <div className="p-6">
          <div className="h-32 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

interface RulesConfigFormProps {
  guildId: string;
  config: RulesConfig | null | undefined;
  form: RulesFormState;
  setForm: React.Dispatch<React.SetStateAction<RulesFormState>>;
  onSetup: () => void;
  onDelete: () => void;
  isUpdating: boolean;
  isSettingUp: boolean;
  isDeleting: boolean;
}

export function RulesConfigForm({
  guildId,
  config,
  form,
  setForm,
  onSetup,
  onDelete,
  isUpdating,
  isSettingUp,
  isDeleting,
}: RulesConfigFormProps) {
  const rulesTextId = useId();

  const isPosted = !!config?.messageId;

  return (
    <>
      <ConfigSection
        title="Channel & Role"
        description="Configure where rules are posted and what role is granted"
      >
        <ChannelPicker
          guildId={guildId}
          value={form.channelId}
          onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
          filter="text"
          label="Rules Channel"
          placeholder="Select channel for rules message"
          clearable
          disabled={isUpdating}
        />
        <RolePicker
          guildId={guildId}
          value={form.roleId}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              roleId: Array.isArray(value) ? value[0] ?? null : value,
            }))
          }
          label="Acknowledge Role"
          placeholder="Select role granted on acknowledgment"
          clearable
          disabled={isUpdating}
        />
        <div>
          <EmojiPicker
            value={form.emoji ?? ""}
            onChange={(emoji) =>
              setForm((prev) => ({ ...prev, emoji: emoji || null }))
            }
            label="Reaction Emoji"
            disabled={isUpdating}
          />
          <p className="text-xs text-muted-foreground mt-1">
            The emoji users react with to acknowledge the rules
          </p>
        </div>
      </ConfigSection>

      <ConfigSection
        title="Rules Message"
        description="The message posted in the rules channel"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={rulesTextId} className="text-sm font-medium">
              Custom Rules Text
            </label>
            {form.customText !== null && (
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, customText: null }))
                }
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Reset to default template"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
          <EmojiTextarea
            id={rulesTextId}
            value={form.customText ?? ""}
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                customText: v || null,
              }))
            }
            placeholder="Enter your server rules here..."
            rows={8}
            maxLength={MAX_RULES_TEXT}
            disabled={isUpdating}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              This message will be posted in the rules channel. Users react to
              acknowledge.
            </p>
            <span className="text-xs text-muted-foreground">
              {(form.customText ?? "").length} / {MAX_RULES_TEXT}
            </span>
          </div>
        </div>
      </ConfigSection>

      {/* Setup Section */}
      <ConfigSection title="Post Rules">
        {isPosted ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Rules message is active</span>
            </div>
            <Button variant="outline" onClick={onSetup} disabled={isSettingUp}>
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Re-post Rules
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>No rules message posted yet</span>
            </div>
            <Button onClick={onSetup} disabled={isSettingUp || !form.channelId}>
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Rules Message
                </>
              )}
            </Button>
          </div>
        )}
      </ConfigSection>

      {/* Remove Rules */}
      {config && (
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Rules
          </Button>
        </div>
      )}
    </>
  );
}
