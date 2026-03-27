import { PageHeader } from "@/components/dashboard/PageHeader";
import { SaveBar } from "@/components/forms/SaveBar";
import {
  DEFAULT_STATE,
  RulesConfigForm,
  SkeletonRulesPage,
} from "@/components/rules";
import type { RulesFormState } from "@/components/rules";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useDeleteRulesConfig,
  useRulesConfig,
  useSetupRules,
  useUpdateRulesConfig,
} from "@/hooks/useRules";
import { deepEqual } from "@/lib/utils";
import { FadeIn } from "@ninsys/ui/components/animations";
import { useCallback, useEffect, useState } from "react";

export function RulesPage() {
  const { guildId } = useCurrentGuild();
  const { data: config, isLoading } = useRulesConfig(guildId);
  const updateConfig = useUpdateRulesConfig(guildId);
  const deleteConfig = useDeleteRulesConfig(guildId);
  const setupRules = useSetupRules(guildId);
  usePageTitle("Rules");

  const [form, setForm] = useState<RulesFormState>(DEFAULT_STATE);
  const [original, setOriginal] = useState<RulesFormState>(DEFAULT_STATE);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSetupConfirm, setShowSetupConfirm] = useState(false);

  useEffect(() => {
    if (config) {
      const state: RulesFormState = {
        channelId: config.channelId,
        roleId: config.roleId,
        emoji: config.emoji,
        customText: config.customText,
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

  const handleDelete = useCallback(() => {
    deleteConfig.mutate(undefined, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
  }, [deleteConfig]);

  const handleSetup = useCallback(() => {
    setupRules.mutate(undefined, {
      onSuccess: () => setShowSetupConfirm(false),
    });
  }, [setupRules]);

  if (isLoading) {
    return (
      <FadeIn>
        <PageHeader
          title="Rules Acknowledgment"
          description="Configure the rules message and acknowledgment role"
        />
        <SkeletonRulesPage />
      </FadeIn>
    );
  }

  const isPosted = !!config?.messageId;

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Rules Acknowledgment"
        description="Configure the rules message and acknowledgment role"
      />

      <div className="space-y-6">
        <RulesConfigForm
          guildId={guildId}
          config={config}
          form={form}
          setForm={setForm}
          onSetup={() => setShowSetupConfirm(true)}
          onDelete={() => setShowDeleteConfirm(true)}
          isUpdating={updateConfig.isPending}
          isSettingUp={setupRules.isPending}
          isDeleting={deleteConfig.isPending}
        />

        <SaveBar
          isDirty={isDirty}
          isLoading={updateConfig.isPending}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>

      <ConfirmDialog
        open={showSetupConfirm}
        onOpenChange={setShowSetupConfirm}
        title={isPosted ? "Re-post Rules Message" : "Post Rules Message"}
        description={`This will ${
          isPosted ? "re-post" : "post"
        } the rules message in the selected channel. Continue?`}
        confirmLabel={isPosted ? "Re-post" : "Post"}
        onConfirm={handleSetup}
        isLoading={setupRules.isPending}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Remove Rules System"
        description="Remove the rules system? The rules message will remain in Discord but reactions will no longer be tracked."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteConfig.isPending}
      />
    </FadeIn>
  );
}
