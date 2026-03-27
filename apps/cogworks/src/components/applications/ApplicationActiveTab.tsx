import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  useActiveApplications,
  useApproveApplication,
  useArchiveApplication,
  useDenyApplication,
  usePositions,
} from "@/hooks/useApplications";
import type { Application } from "@/types/applications";
import { Button } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  CheckCircle,
  ClipboardList,
  Eye,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

interface ApplicationActiveTabProps {
  guildId: string;
}

type AppStatus = "all" | "pending" | "approved" | "denied" | "archived";

function ApplicationDetailPanel({
  app,
  onClose,
  guildId,
}: {
  app: Application;
  onClose: () => void;
  guildId: string;
}) {
  const approveApp = useApproveApplication(guildId);
  const denyApp = useDenyApplication(guildId);
  const archiveApp = useArchiveApplication(guildId);

  const [showApprove, setShowApprove] = useState(false);
  const [showDeny, setShowDeny] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [denyReason, setDenyReason] = useState("");
  const approveNoteId = useId();
  const denyReasonId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const responseEntries = useMemo(
    () => Object.entries(app.responses),
    [app.responses]
  );

  const canApprove = app.status === "pending";
  const canDeny = app.status === "pending";
  const canArchive = app.status !== "archived";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-lg border-l border-border bg-card shadow-xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Application Details</h3>
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
              <StatusBadge status={app.status} />
              <span className="text-sm text-muted-foreground">
                #{app.id.slice(0, 8)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Position</p>
                <p className="text-sm font-medium mt-0.5">
                  {app.positionTitle}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applicant</p>
                <p className="text-sm font-medium mt-0.5">
                  {app.applicantUsername}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(app.createdAt).toLocaleString()}
                </p>
              </div>
              {app.reviewedBy && (
                <div>
                  <p className="text-xs text-muted-foreground">Reviewed By</p>
                  <p className="text-sm font-medium mt-0.5">{app.reviewedBy}</p>
                </div>
              )}
            </div>

            {app.reviewedAt && (
              <div>
                <p className="text-xs text-muted-foreground">Reviewed At</p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(app.reviewedAt).toLocaleString()}
                </p>
              </div>
            )}

            {app.reviewNote && (
              <div>
                <p className="text-xs text-muted-foreground">Review Note</p>
                <p className="text-sm mt-0.5 bg-muted/30 rounded-lg p-3">
                  {app.reviewNote}
                </p>
              </div>
            )}

            {responseEntries.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-sm font-semibold">Responses</h4>
                {responseEntries.map(([label, response]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm mt-0.5 whitespace-pre-wrap">
                      {response}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {(canApprove || canDeny || canArchive) && (
              <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                {canApprove && (
                  <Button onClick={() => setShowApprove(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {canDeny && (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setShowDeny(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny
                  </Button>
                )}
                {canArchive && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      archiveApp.mutate(app.id, {
                        onSuccess: onClose,
                      });
                    }}
                    disabled={archiveApp.isPending}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {archiveApp.isPending ? "Archiving..." : "Archive"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Approve Dialog */}
      <ConfirmDialog
        open={showApprove}
        onOpenChange={setShowApprove}
        title="Approve Application"
        description={`Approve ${app.applicantUsername}'s application for ${app.positionTitle}?`}
        confirmLabel="Approve Application"
        isLoading={approveApp.isPending}
        onConfirm={() => {
          approveApp.mutate(
            { appId: app.id, note: approveNote || undefined },
            {
              onSuccess: () => {
                setShowApprove(false);
                setApproveNote("");
                onClose();
              },
            }
          );
        }}
      >
        <div>
          <label
            htmlFor={approveNoteId}
            className="text-sm font-medium mb-1.5 block"
          >
            Note (optional)
          </label>
          <textarea
            id={approveNoteId}
            value={approveNote}
            onChange={(e) => setApproveNote(e.target.value)}
            placeholder="Add an optional note..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
            rows={3}
          />
        </div>
      </ConfirmDialog>

      {/* Deny Dialog */}
      <ConfirmDialog
        open={showDeny}
        onOpenChange={(open) => {
          if (!open) {
            setShowDeny(false);
            setDenyReason("");
          }
        }}
        title="Deny Application"
        description={`Deny ${app.applicantUsername}'s application for ${app.positionTitle}?`}
        confirmLabel="Deny Application"
        variant="destructive"
        isLoading={denyApp.isPending}
        confirmDisabled={!denyReason.trim()}
        onConfirm={() => {
          if (!denyReason.trim()) return;
          denyApp.mutate(
            { appId: app.id, reason: denyReason },
            {
              onSuccess: () => {
                setShowDeny(false);
                setDenyReason("");
                onClose();
              },
            }
          );
        }}
      >
        <div>
          <label
            htmlFor={denyReasonId}
            className="text-sm font-medium mb-1.5 block"
          >
            Reason (required)
          </label>
          <textarea
            id={denyReasonId}
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            placeholder="Provide a reason for denial..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
            rows={3}
            required
          />
        </div>
      </ConfirmDialog>
    </>
  );
}

export function ApplicationActiveTab({ guildId }: ApplicationActiveTabProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AppStatus>("all");
  const [positionFilter, setPositionFilter] = useState<string>("");
  const { data: positions = [] } = usePositions(guildId);
  const { data, isLoading } = useActiveApplications(guildId, {
    page,
    status: statusFilter,
    positionId: positionFilter || undefined,
  });

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const columns: Column<Application>[] = useMemo(
    () => [
      {
        key: "positionTitle",
        header: "Position",
        render: (row) => (
          <span className="text-sm font-medium">{row.positionTitle}</span>
        ),
      },
      {
        key: "applicantUsername",
        header: "Applicant",
        render: (row) => (
          <span className="text-sm">{row.applicantUsername}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "createdAt",
        header: "Submitted",
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
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v as AppStatus);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "denied", label: "Denied" },
            { value: "archived", label: "Archived" },
          ]}
        />

        {positions.length > 0 && (
          <Select
            value={positionFilter}
            onChange={(v) => {
              setPositionFilter(v);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Positions" },
              ...positions.map((pos) => ({
                value: pos.id,
                label: pos.emoji ? `${pos.emoji} ${pos.title}` : pos.title,
              })),
            ]}
          />
        )}
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        pagination={data?.pagination}
        onPageChange={setPage}
        emptyState={{
          title: "No applications",
          description: "No applications match the current filters.",
          icon: ClipboardList,
        }}
        rowActions={(row) => [
          {
            label: "View Details",
            icon: Eye,
            onClick: () => setSelectedApp(row),
          },
        ]}
      />

      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailPanel
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            guildId={guildId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
