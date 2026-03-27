import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import {
  useAddRestriction,
  useRemoveRestriction,
  useTicketRestrictions,
  useTicketTypes,
} from "@/hooks/useTickets";
import type { UserTicketRestriction } from "@/types/tickets";
import { Button, Input } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ShieldBan, Trash2, X } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

interface TicketRestrictionsTabProps {
  guildId: string;
}

function AddRestrictionForm({
  guildId,
  onClose,
}: {
  guildId: string;
  onClose: () => void;
}) {
  const addRestriction = useAddRestriction(guildId);
  const { data: types = [] } = useTicketTypes(guildId);
  const id = useId();

  const [userId, setUserId] = useState("");
  const [typeId, setTypeId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const handleSubmit = useCallback(() => {
    if (!userId.trim()) return;
    addRestriction.mutate(
      { userId: userId.trim(), typeId, reason: reason.trim() },
      { onSuccess: onClose }
    );
  }, [userId, typeId, reason, addRestriction, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="rounded-lg border border-border bg-card p-4 space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Add Restriction</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label
            htmlFor={`${id}-userId`}
            className="text-sm font-medium mb-1.5 block"
          >
            User ID
          </label>
          <Input
            id={`${id}-userId`}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Discord user ID"
            disabled={addRestriction.isPending}
          />
        </div>

        <Select
          value={typeId ?? ""}
          onChange={(v) => setTypeId(v || null)}
          options={[
            { value: "", label: "All types" },
            ...types.map((t) => ({ value: t.typeId, label: t.displayName })),
          ]}
          label="Ticket Type"
          disabled={addRestriction.isPending}
        />

        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Reason</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for restriction"
            disabled={addRestriction.isPending}
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={addRestriction.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!userId.trim() || addRestriction.isPending}
          >
            {addRestriction.isPending ? "Adding..." : "Add Restriction"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function TicketRestrictionsTab({ guildId }: TicketRestrictionsTabProps) {
  const { data: restrictions = [], isLoading } = useTicketRestrictions(guildId);
  const { data: types = [] } = useTicketTypes(guildId);
  const removeRestriction = useRemoveRestriction(guildId);

  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<UserTicketRestriction | null>(null);

  const typeNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of types) {
      map.set(t.typeId, t.displayName);
    }
    return map;
  }, [types]);

  const filtered = useMemo(() => {
    if (!search) return restrictions;
    const q = search.toLowerCase();
    return restrictions.filter(
      (r) => r.username.toLowerCase().includes(q) || r.userId.includes(q)
    );
  }, [restrictions, search]);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    removeRestriction.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, removeRestriction]);

  const columns: Column<UserTicketRestriction>[] = useMemo(
    () => [
      {
        key: "username",
        header: "User",
        render: (row) => (
          <div>
            <span className="font-medium">{row.username}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {row.userId}
            </span>
          </div>
        ),
      },
      {
        key: "typeId",
        header: "Type",
        render: (row) => (
          <span className="text-sm">
            {row.typeId
              ? typeNameMap.get(row.typeId) ?? "Unknown"
              : "All types"}
          </span>
        ),
      },
      {
        key: "reason",
        header: "Reason",
        render: (row) => (
          <span className="text-sm text-muted-foreground truncate max-w-xs block">
            {row.reason}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Date",
        render: (row) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [typeNameMap]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {restrictions.length} restriction
          {restrictions.length !== 1 ? "s" : ""}
        </p>
        {!isAdding && (
          <Button variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Restriction
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <AddRestrictionForm
            guildId={guildId}
            onClose={() => setIsAdding(false)}
          />
        )}
      </AnimatePresence>

      <DataTable
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by username or ID..."
        emptyState={{
          title: "No restrictions",
          description:
            "No users are currently restricted from creating tickets.",
          icon: ShieldBan,
        }}
        rowActions={(row) => [
          {
            label: "Remove",
            icon: Trash2,
            variant: "destructive",
            onClick: () => setDeleteTarget(row),
          },
        ]}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove Restriction"
        description={`Remove the restriction for ${deleteTarget?.username}? They will be able to create tickets again.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={removeRestriction.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
