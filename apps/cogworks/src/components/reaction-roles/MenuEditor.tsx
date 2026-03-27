import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  useDeleteReactionRoleMenu,
  useReactionRoleMenu,
  useRebuildMenu,
  useReorderReactionRoleOptions,
  useUpdateReactionRoleMenu,
  useValidateMenu,
} from "@/hooks/useReactionRoles";
import { deepEqual } from "@/lib/utils";
import type { ReactionRoleMode } from "@/types/reaction-roles";
import { Button, Input } from "@ninsys/ui/components";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { AddOptionForm } from "./AddOptionForm";
import { OptionRow } from "./OptionRow";
import { MODE_INFO } from "./constants";

export function MenuEditor({
  guildId,
  menuId,
  onBack,
}: {
  guildId: string;
  menuId: string;
  onBack: () => void;
}) {
  const { data: menu, isLoading } = useReactionRoleMenu(guildId, menuId);
  const updateMenu = useUpdateReactionRoleMenu(guildId);
  const deleteMenu = useDeleteReactionRoleMenu(guildId);
  const validateMenu = useValidateMenu(guildId);
  const rebuildMenu = useRebuildMenu(guildId);
  const reorderOptions = useReorderReactionRoleOptions(guildId);

  const [form, setForm] = useState({
    name: "",
    description: "",
    channelId: null as string | null,
    mode: "normal" as ReactionRoleMode,
  });
  const [original, setOriginal] = useState(form);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRebuildConfirm, setShowRebuildConfirm] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    issues: string[];
  } | null>(null);

  const nameId = useId();
  const descId = useId();

  useEffect(() => {
    if (menu) {
      const state = {
        name: menu.name,
        description: menu.description ?? "",
        channelId: menu.channelId,
        mode: menu.mode,
      };
      setForm(state);
      setOriginal(state);
    }
  }, [menu]);

  const isDirty = !deepEqual(form, original);

  const handleSave = useCallback(() => {
    updateMenu.mutate(
      {
        menuId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        channelId: form.channelId,
        mode: form.mode,
      },
      { onSuccess: () => setOriginal(form) }
    );
  }, [form, menuId, updateMenu]);

  const handleDiscard = useCallback(() => {
    setForm(original);
  }, [original]);

  const handleDelete = useCallback(() => {
    deleteMenu.mutate(menuId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        onBack();
      },
    });
  }, [menuId, deleteMenu, onBack]);

  const handleValidate = useCallback(() => {
    validateMenu.mutate(menuId, {
      onSuccess: (data) => {
        if (data) setValidationResult(data);
      },
    });
  }, [menuId, validateMenu]);

  const handleRebuild = useCallback(() => {
    rebuildMenu.mutate(menuId, {
      onSuccess: () => setShowRebuildConfirm(false),
    });
  }, [menuId, rebuildMenu]);

  const sortedOptions = useMemo(
    () => [...(menu?.options ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [menu?.options]
  );

  const handleMoveOption = useCallback(
    (fromIndex: number, direction: -1 | 1) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= sortedOptions.length) return;
      const newOrder = sortedOptions.map((o) => o.id);
      const [moved] = newOrder.splice(fromIndex, 1);
      if (moved) {
        newOrder.splice(toIndex, 0, moved);
        reorderOptions.mutate({ menuId, optionIds: newOrder });
      }
    },
    [sortedOptions, reorderOptions, menuId]
  );

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Menu not found</p>
        <Button variant="ghost" onClick={onBack} className="mt-2">
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to menus
      </button>

      {/* Validation Banner */}
      {validationResult && (
        <div
          className={`rounded-lg p-3 text-sm flex items-start gap-2 ${
            validationResult.valid
              ? "bg-green-500/10 text-green-600"
              : "bg-amber-500/10 text-amber-600"
          }`}
        >
          {validationResult.valid ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            {validationResult.valid ? (
              "All options are valid!"
            ) : (
              <ul className="space-y-0.5">
                {validationResult.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => setValidationResult(null)}
            className="p-0.5 rounded hover:bg-black/10"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Menu Settings */}
      <ConfigSection
        title="Menu Settings"
        description="Configure the menu name, channel, and mode"
      >
        <div>
          <label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
            Name
          </label>
          <Input
            id={nameId}
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={updateMenu.isPending}
          />
        </div>
        <div>
          <label htmlFor={descId} className="text-sm font-medium mb-1.5 block">
            Description{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <Input
            id={descId}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            disabled={updateMenu.isPending}
          />
        </div>
        <ChannelPicker
          guildId={guildId}
          value={form.channelId}
          onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
          filter="text"
          label="Target Channel"
          placeholder="Select channel"
          clearable
          disabled={updateMenu.isPending}
        />
        <div>
          <p className="text-sm font-medium mb-2">Mode</p>
          <div className="space-y-2">
            {(
              Object.entries(MODE_INFO) as [
                ReactionRoleMode,
                { label: string; description: string }
              ][]
            ).map(([key, info]) => (
              <label
                key={key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  form.mode === key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="edit-mode"
                  value={key}
                  checked={form.mode === key}
                  onChange={() => setForm((prev) => ({ ...prev, mode: key }))}
                  className="mt-0.5"
                  disabled={updateMenu.isPending}
                />
                <div>
                  <span className="text-sm font-medium">{info.label}</span>
                  <p className="text-xs text-muted-foreground">
                    {info.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </ConfigSection>

      {/* Options */}
      <ConfigSection
        title={`Options (${sortedOptions.length})`}
        description="Configure the emoji + role options for this menu"
      >
        {sortedOptions.length === 0 && !isAddingOption && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No options yet. Add one to get started.
          </p>
        )}

        <div className="space-y-2">
          {sortedOptions.map((option, i) => (
            <OptionRow
              key={option.id}
              option={option}
              index={i}
              total={sortedOptions.length}
              guildId={guildId}
              menuId={menuId}
              onMoveUp={() => handleMoveOption(i, -1)}
              onMoveDown={() => handleMoveOption(i, 1)}
            />
          ))}
        </div>

        {isAddingOption ? (
          <AddOptionForm
            guildId={guildId}
            menuId={menuId}
            onDone={() => setIsAddingOption(false)}
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAddingOption(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        )}
      </ConfigSection>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={handleValidate}
          disabled={validateMenu.isPending}
        >
          {validateMenu.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Validate
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowRebuildConfirm(true)}
          disabled={rebuildMenu.isPending}
        >
          {rebuildMenu.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Rebuild
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
          disabled={deleteMenu.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Menu
        </Button>
      </div>

      <SaveBar
        isDirty={isDirty}
        isLoading={updateMenu.isPending}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      <ConfirmDialog
        open={showRebuildConfirm}
        onOpenChange={setShowRebuildConfirm}
        title="Rebuild Menu"
        description="This will re-post the reaction role message in the selected channel. Continue?"
        confirmLabel="Rebuild"
        onConfirm={handleRebuild}
        isLoading={rebuildMenu.isPending}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Menu"
        description="Delete this menu? The message in Discord will remain but reactions will stop working."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMenu.isPending}
      />
    </div>
  );
}
