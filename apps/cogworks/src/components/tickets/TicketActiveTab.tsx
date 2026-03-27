import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  useActiveTickets,
  useAssignTicket,
  useCloseTicket,
  useTicketDetail,
  useTicketTypes,
} from "@/hooks/useTickets";
import type { Ticket } from "@/types/tickets";
import { Button, Input } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  Hash,
  Ticket as TicketIcon,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TicketActiveTabProps {
  guildId: string;
}

function TicketDetailPanel({
  ticketSnapshot,
  onClose,
  guildId,
}: {
  ticketSnapshot: Ticket;
  onClose: () => void;
  guildId: string;
}) {
  // Use live data, fall back to snapshot
  const { data: liveTicket } = useTicketDetail(guildId, ticketSnapshot.id);
  const ticket = liveTicket ?? ticketSnapshot;

  const closeTicket = useCloseTicket(guildId);
  const assignTicket = useAssignTicket(guildId);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAssign = useCallback(() => {
    const id = assignUserId.trim();
    if (!id || !/^\d{17,20}$/.test(id)) return;
    assignTicket.mutate(
      { ticketId: ticket.id, userId: id },
      {
        onSuccess: () => {
          setShowAssign(false);
          setAssignUserId("");
        },
      }
    );
  }, [assignUserId, ticket.id, assignTicket]);

  const panel = (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ticket details"
        tabIndex={-1}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md border-l border-border bg-card shadow-xl z-50 overflow-y-auto outline-none"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Ticket Details</h3>
            <button
              type="button"
              aria-label="Close panel"
              onClick={onClose}
              className="p-1 rounded hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={ticket.status} />
              <span className="text-sm text-muted-foreground">
                #{ticket.id.slice(0, 8)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium mt-0.5">{ticket.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="text-sm font-medium mt-0.5">
                  {ticket.createdByUsername}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium mt-0.5">
                  {ticket.assignedTo ?? "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Channel link */}
            {ticket.channelId && (
              <div>
                <p className="text-xs text-muted-foreground">Channel</p>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {ticket.channelId}
                </p>
              </div>
            )}

            {ticket.closedAt && (
              <div>
                <p className="text-xs text-muted-foreground">Closed At</p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(ticket.closedAt).toLocaleString()}
                </p>
              </div>
            )}

            {ticket.status === "open" && (
              <div className="pt-4 border-t border-border space-y-2">
                {/* Assign action */}
                {showAssign ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={assignUserId}
                      onChange={(e) => setAssignUserId(e.target.value)}
                      placeholder="Discord User ID"
                      className="flex-1"
                      disabled={assignTicket.isPending}
                    />
                    <Button
                      onClick={handleAssign}
                      disabled={!assignUserId.trim() || assignTicket.isPending}
                    >
                      {assignTicket.isPending ? "..." : "Assign"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAssign(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAssign(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Ticket
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setShowCloseConfirm(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Ticket
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        title="Close Ticket"
        description="Are you sure you want to close this ticket?"
        confirmLabel="Close Ticket"
        variant="destructive"
        isLoading={closeTicket.isPending}
        onConfirm={() => {
          closeTicket.mutate(
            { ticketId: ticket.id },
            {
              onSuccess: () => {
                setShowCloseConfirm(false);
                onClose();
              },
            }
          );
        }}
      />
    </>
  );

  return createPortal(panel, document.body);
}

export function TicketActiveTab({ guildId }: TicketActiveTabProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { data, isLoading } = useActiveTickets(guildId, {
    page,
    status: statusFilter,
  });
  const { data: ticketTypes = [] } = useTicketTypes(guildId);
  const closeTicket = useCloseTicket(guildId);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [closeTarget, setCloseTarget] = useState<Ticket | null>(null);

  // Client-side type filter (API may not support it)
  const filteredData = useMemo(() => {
    if (typeFilter === "all") return data?.data ?? [];
    return (data?.data ?? []).filter((t) => t.type === typeFilter);
  }, [data?.data, typeFilter]);

  // Unique type names from current data for filter dropdown
  const typeNames = useMemo(() => {
    const names = new Set<string>();
    for (const t of data?.data ?? []) {
      names.add(t.type);
    }
    // Also add from ticket types config
    for (const t of ticketTypes) {
      names.add(t.displayName);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [data?.data, ticketTypes]);

  const columns: Column<Ticket>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: "100px",
        render: (row) => (
          <span className="text-xs font-mono text-muted-foreground">
            #{row.id.slice(0, 8)}
          </span>
        ),
      },
      {
        key: "type",
        header: "Type",
        render: (row) => <span className="text-sm">{row.type}</span>,
      },
      {
        key: "createdBy",
        header: "Created By",
        render: (row) => (
          <span className="text-sm">{row.createdByUsername}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "assignedTo",
        header: "Assigned",
        render: (row) => (
          <span
            className={cn(
              "text-sm",
              !row.assignedTo && "text-muted-foreground"
            )}
          >
            {row.assignedTo ?? "Unassigned"}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        render: (row) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v as "all" | "open" | "closed");
            setPage(1);
          }}
          options={[
            { value: "all", label: "All Status" },
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
          ]}
          aria-label="Filter by status"
        />
        {typeNames.length > 0 && (
          <Select
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
            options={[
              { value: "all", label: "All Types" },
              ...typeNames.map((name) => ({ value: name, label: name })),
            ]}
            aria-label="Filter by type"
          />
        )}
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        pagination={typeFilter === "all" ? data?.pagination : undefined}
        onPageChange={setPage}
        emptyState={{
          title: "No tickets",
          description: "No tickets match the current filters.",
          icon: TicketIcon,
        }}
        rowActions={(row) => [
          {
            label: "View Details",
            icon: Eye,
            onClick: () => setSelectedTicket(row),
          },
          ...(row.status === "open"
            ? [
                {
                  label: "Close",
                  icon: XCircle,
                  variant: "destructive" as const,
                  onClick: () => setCloseTarget(row),
                },
              ]
            : []),
        ]}
      />

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailPanel
            key={selectedTicket.id}
            ticketSnapshot={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            guildId={guildId}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={closeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCloseTarget(null);
        }}
        title="Close Ticket"
        description={`Close ticket #${closeTarget?.id.slice(
          0,
          8
        )}? This will mark it as resolved.`}
        confirmLabel="Close Ticket"
        variant="destructive"
        isLoading={closeTicket.isPending}
        onConfirm={() => {
          if (!closeTarget) return;
          closeTicket.mutate(
            { ticketId: closeTarget.id },
            {
              onSuccess: () => setCloseTarget(null),
            }
          );
        }}
      />
    </div>
  );
}
