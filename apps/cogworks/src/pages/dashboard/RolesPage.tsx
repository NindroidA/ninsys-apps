import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { useRoles as useDiscordRoles } from "@/hooks/useDiscord";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useAddRole,
  useDeleteRole,
  useSavedRoles,
  useUpdateRole,
} from "@/hooks/useRoles";
import { extractDiscordId, intToHex, normalizeColor } from "@/lib/utils";
import type { RoleType, SavedRole } from "@/types/roles";
import { Button, Input } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { Pencil, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface AddRoleFormState {
  type: RoleType;
  roleId: string | null;
  alias: string;
}

function RoleRow({
  role,
  roleName,
  roleColor,
  guildId,
  onDelete,
}: {
  role: SavedRole;
  roleName: string;
  roleColor: number;
  guildId: string;
  onDelete: (role: SavedRole) => void;
}) {
  const updateRole = useUpdateRole(guildId);
  const [alias, setAlias] = useState(role.alias || "");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!isEditing) {
      setAlias(role.alias || "");
    }
  }, [role.alias, isEditing]);

  const handleSaveAlias = useCallback(() => {
    if (updateRole.isPending) return;
    const trimmed = alias.trim();
    const newAlias = trimmed || null;
    if (newAlias !== (role.alias || null)) {
      updateRole.mutate({ id: role.id, alias: newAlias });
    }
    setIsEditing(false);
  }, [alias, role.alias, role.id, updateRole]);

  return (
    <div className="px-4 py-3 border-b border-border last:border-b-0 space-y-2">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: intToHex(roleColor) }}
        />
        <span className="font-medium text-sm flex-1 min-w-0 truncate">
          {roleName}
        </span>
        <button
          type="button"
          aria-label={`Remove ${roleName}`}
          onClick={() => onDelete(role)}
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="ml-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
          Alias
        </p>
        {isEditing ? (
          <Input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onBlur={handleSaveAlias}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveAlias();
              }
              if (e.key === "Escape") {
                setAlias(role.alias || "");
                setIsEditing(false);
              }
            }}
            placeholder="Enter an alias..."
            className="h-8 text-sm"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md border border-dashed border-border hover:border-primary/40 hover:bg-muted/30 transition-all group text-left"
          >
            {role.alias ? (
              <span className="text-sm text-accent flex-1 truncate">
                {role.alias}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground/50 italic flex-1">
                No alias set
              </span>
            )}
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
}

function AddRoleRow({
  type,
  guildId,
  onCancel,
}: {
  type: RoleType;
  guildId: string;
  onCancel: () => void;
}) {
  const addRole = useAddRole(guildId);
  const [form, setForm] = useState<AddRoleFormState>({
    type,
    roleId: null,
    alias: "",
  });

  const handleSave = useCallback(() => {
    if (!form.roleId) return;
    addRole.mutate(
      {
        role: form.roleId,
        type: form.type,
        alias: form.alias.trim() || undefined,
      },
      { onSuccess: onCancel }
    );
  }, [form, addRole, onCancel]);

  return (
    <div className="py-3 space-y-3">
      <RolePicker
        guildId={guildId}
        value={form.roleId}
        onChange={(roleId) =>
          setForm((prev) => ({ ...prev, roleId: roleId as string | null }))
        }
        placeholder={`Select a ${type} role`}
        disabled={addRole.isPending}
      />
      <Input
        value={form.alias}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, alias: e.target.value }))
        }
        placeholder="Alias (optional)"
        disabled={addRole.isPending}
      />
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={addRole.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!form.roleId || addRole.isPending}
        >
          {addRole.isPending ? "Adding..." : "Add Role"}
        </Button>
      </div>
    </div>
  );
}

function RoleSection({
  title,
  description,
  type,
  roles,
  guildId,
  roleInfoMap,
  onDelete,
}: {
  title: string;
  description: string;
  type: RoleType;
  roles: SavedRole[];
  guildId: string;
  roleInfoMap: Map<string, { name: string; color: number }>;
  onDelete: (role: SavedRole) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const filtered = roles.filter((r) => r.type === type);

  return (
    <ConfigSection title={title} description={description}>
      {filtered.length === 0 && !isAdding ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No {type} roles configured
        </p>
      ) : (
        <div className="rounded-lg border border-border -mx-2">
          {filtered.map((role) => {
            const id = extractDiscordId(role.role);
            const info = roleInfoMap.get(id);
            return (
              <RoleRow
                key={role.id}
                role={role}
                roleName={info?.name ?? id}
                roleColor={info?.color ?? 0}
                guildId={guildId}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}

      {isAdding && (
        <AddRoleRow
          type={type}
          guildId={guildId}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {!isAdding && (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title.replace(" Roles", "")} Role
        </Button>
      )}
    </ConfigSection>
  );
}

function SkeletonRoles() {
  return (
    <div className="space-y-6 animate-pulse">
      {[0, 1].map((i) => (
        <div
          key={`skel-role-${i}`}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-4 w-56 rounded bg-muted mt-2" />
          </div>
          <div className="p-6">
            <div className="h-12 rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RolesPage() {
  const { guildId } = useCurrentGuild();
  const { data: roles = [], isLoading } = useSavedRoles(guildId);
  const { data: discordRoles = [] } = useDiscordRoles(guildId);
  const deleteRole = useDeleteRole(guildId);
  usePageTitle("Role Management");

  const roleInfoMap = useMemo(() => {
    const map = new Map<string, { name: string; color: number }>();
    for (const r of discordRoles) {
      map.set(r.id, { name: r.name, color: normalizeColor(r.color) });
    }
    return map;
  }, [discordRoles]);

  const [deleteTarget, setDeleteTarget] = useState<SavedRole | null>(null);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteRole.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteRole]);

  if (isLoading) {
    return (
      <FadeIn>
        <PageHeader title="Role Management" />
        <SkeletonRoles />
      </FadeIn>
    );
  }

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Role Management"
        description="Configure staff and admin roles for Cogworks"
      />

      <StaggerContainer className="space-y-6">
        <RoleSection
          title="Staff Roles"
          description="Roles that grant access to standard bot features"
          type="staff"
          roles={roles}
          guildId={guildId}
          roleInfoMap={roleInfoMap}
          onDelete={setDeleteTarget}
        />
        <RoleSection
          title="Admin Roles"
          description="Roles that grant full administrative access"
          type="admin"
          roles={roles}
          guildId={guildId}
          roleInfoMap={roleInfoMap}
          onDelete={setDeleteTarget}
        />
      </StaggerContainer>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove Role"
        description="Remove this role? Members with this role will lose associated permissions."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteRole.isPending}
        onConfirm={handleConfirmDelete}
      />
    </FadeIn>
  );
}
