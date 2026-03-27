import { RolePicker } from "@/components/discord/RolePicker";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { useAddReactionRoleOption } from "@/hooks/useReactionRoles";
import { Button, Input } from "@ninsys/ui/components";
import { useCallback, useId, useState } from "react";

export function AddOptionForm({
  guildId,
  menuId,
  onDone,
}: {
  guildId: string;
  menuId: string;
  onDone: () => void;
}) {
  const [emoji, setEmoji] = useState("");
  const [roleId, setRoleId] = useState("");
  const [description, setDescription] = useState("");
  const addOption = useAddReactionRoleOption(guildId);

  const descId = useId();

  const handleAdd = useCallback(() => {
    if (!emoji || !roleId) return;
    addOption.mutate(
      {
        menuId,
        emoji,
        roleId,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setEmoji("");
          setRoleId("");
          setDescription("");
          onDone();
        },
      }
    );
  }, [emoji, roleId, description, menuId, addOption, onDone]);

  return (
    <div className="p-3 rounded-lg border border-dashed border-primary/50 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <EmojiPicker
            value={emoji}
            onChange={setEmoji}
            label="Emoji"
            disabled={addOption.isPending}
          />
        </div>
        <div>
          <label htmlFor={descId} className="text-xs font-medium mb-1 block">
            Description{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id={descId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            disabled={addOption.isPending}
          />
        </div>
      </div>
      <RolePicker
        guildId={guildId}
        value={roleId || null}
        onChange={(value) => {
          const v = Array.isArray(value) ? value[0] ?? "" : value ?? "";
          setRoleId(v);
        }}
        label="Role"
        disabled={addOption.isPending}
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onDone} disabled={addOption.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={!emoji || !roleId || addOption.isPending}
        >
          {addOption.isPending ? "Adding..." : "Add Option"}
        </Button>
      </div>
    </div>
  );
}
