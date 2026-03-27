import { RolePicker } from "@/components/discord/RolePicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { useRoles } from "@/hooks/useDiscord";
import {
  useDeleteReactionRoleOption,
  useUpdateReactionRoleOption,
} from "@/hooks/useReactionRoles";
import type { ReactionRoleOption } from "@/types/reaction-roles";
import { Button, Input } from "@ninsys/ui/components";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

export function OptionRow({
  option,
  index,
  total,
  guildId,
  menuId,
  onMoveUp,
  onMoveDown,
}: {
  option: ReactionRoleOption;
  index: number;
  total: number;
  guildId: string;
  menuId: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [emoji, setEmoji] = useState(option.emoji);
  const [roleId, setRoleId] = useState(option.roleId);
  const [description, setDescription] = useState(option.description ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEmoji(option.emoji);
      setRoleId(option.roleId);
      setDescription(option.description ?? "");
    }
  }, [option.emoji, option.roleId, option.description, isEditing]);

  const { data: roles } = useRoles(guildId);
  const roleName = useMemo(() => {
    const role = roles?.find((r) => r.id === option.roleId);
    return role?.name ?? null;
  }, [roles, option.roleId]);

  const updateOption = useUpdateReactionRoleOption(guildId);
  const deleteOption = useDeleteReactionRoleOption(guildId);

  const descId = useId();

  const handleSave = useCallback(() => {
    updateOption.mutate(
      {
        menuId,
        optionId: option.id,
        emoji,
        roleId,
        description: description.trim() || null,
      },
      { onSuccess: () => setIsEditing(false) }
    );
  }, [emoji, roleId, description, option.id, menuId, updateOption]);

  const handleDelete = useCallback(() => {
    deleteOption.mutate(
      { menuId, optionId: option.id },
      {
        onSuccess: () => setShowDeleteConfirm(false),
      }
    );
  }, [option.id, menuId, deleteOption]);

  const handleCancel = useCallback(() => {
    setEmoji(option.emoji);
    setRoleId(option.roleId);
    setDescription(option.description ?? "");
    setIsEditing(false);
  }, [option]);

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <EmojiPicker
              value={emoji}
              onChange={setEmoji}
              label="Emoji"
              disabled={updateOption.isPending}
            />
          </div>
          <div>
            <label htmlFor={descId} className="text-xs font-medium mb-1 block">
              Description
            </label>
            <Input
              id={descId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              disabled={updateOption.isPending}
            />
          </div>
        </div>
        <RolePicker
          guildId={guildId}
          value={roleId}
          onChange={(value) => {
            const v = Array.isArray(value) ? value[0] ?? "" : value ?? "";
            setRoleId(v);
          }}
          label="Role"
          disabled={updateOption.isPending}
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={updateOption.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!emoji || !roleId || updateOption.isPending}
          >
            {updateOption.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors group">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />

        {/* Mobile move buttons */}
        <div className="flex flex-col gap-0.5 md:hidden shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>

        <span className="text-lg shrink-0">{option.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">
            {roleName ?? option.roleId}
          </span>
          {option.description && (
            <p className="text-xs text-muted-foreground truncate">
              {option.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 p-0"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-7 w-7 p-0 text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Remove Option"
        description="Remove this reaction role option?"
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteOption.isPending}
      />
    </>
  );
}
