import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import { Select } from "@/components/ui/Select";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useBotStatus,
  useClearBotStatus,
  useSetBotStatus,
} from "@/hooks/useStatus";
import type { StatusLevel } from "@/types/status";
import { Button, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const STATUS_LEVELS: {
  value: StatusLevel;
  label: string;
  description: string;
  color: string;
  icon: typeof CheckCircle2;
}[] = [
  {
    value: "operational",
    label: "Operational",
    description: "All systems working normally",
    color: "text-green-500",
    icon: CheckCircle2,
  },
  {
    value: "degraded",
    label: "Degraded",
    description: "Some systems experiencing slowness",
    color: "text-yellow-500",
    icon: AlertTriangle,
  },
  {
    value: "partial_outage",
    label: "Partial Outage",
    description: "Some systems are unavailable",
    color: "text-orange-500",
    icon: AlertTriangle,
  },
  {
    value: "major_outage",
    label: "Major Outage",
    description: "Most systems are unavailable",
    color: "text-red-500",
    icon: XCircle,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Planned maintenance in progress",
    color: "text-blue-500",
    icon: Wrench,
  },
];

const SYSTEMS = [
  "Tickets",
  "Applications",
  "Announcements",
  "Memory",
  "Rules",
  "Reaction Roles",
  "Bait Channel",
  "All Systems",
];

function getStatusInfo(level: StatusLevel) {
  return STATUS_LEVELS.find((s) => s.value === level) ?? STATUS_LEVELS[0]!;
}

function CountdownTimer({ target }: { target: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Resolution time has passed");
        clearInterval(id);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        setRemaining(`${hours}h ${minutes}m`);
      } else {
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setRemaining(`${minutes}m ${seconds}s`);
      }
    }
    const id = setInterval(update, 1000);
    update();
    return () => clearInterval(id);
  }, [target]);

  const isPassed = remaining === "Resolution time has passed";

  return (
    <span className={isPassed ? "text-amber-500" : "text-muted-foreground"}>
      {isPassed ? remaining : `Estimated resolution in: ${remaining}`}
    </span>
  );
}

export function DashboardStatusPage() {
  const { guildId } = useCurrentGuild();
  const { data: status, isLoading } = useBotStatus(guildId);
  const setStatus = useSetBotStatus(guildId);
  const clearStatus = useClearBotStatus(guildId);
  usePageTitle("Bot Status");

  const [level, setLevel] = useState<StatusLevel>("operational");
  const [message, setMessage] = useState("");
  const [affectedSystems, setAffectedSystems] = useState<string[]>([]);
  const [estimatedResolution, setEstimatedResolution] = useState("");
  const [showSetConfirm, setShowSetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Populate form from existing server status on first load
  const hasPopulated = useRef(false);
  useEffect(() => {
    if (status && !hasPopulated.current) {
      hasPopulated.current = true;
      setLevel(status.level);
      setMessage(status.message ?? "");
      setAffectedSystems(status.affectedSystems ?? []);
      if (status.estimatedResolution) {
        // Convert ISO string to datetime-local format
        const local = new Date(status.estimatedResolution)
          .toISOString()
          .slice(0, 16);
        setEstimatedResolution(local);
      }
    }
  }, [status]);

  const messageId = useId();
  const resolutionId = useId();

  const handleSetStatus = useCallback(() => {
    setStatus.mutate(
      {
        level,
        message: message.trim() || undefined,
        affectedSystems:
          affectedSystems.length > 0 ? affectedSystems : undefined,
        estimatedResolution: estimatedResolution
          ? new Date(estimatedResolution).toISOString()
          : null,
      },
      { onSuccess: () => setShowSetConfirm(false) }
    );
  }, [level, message, affectedSystems, estimatedResolution, setStatus]);

  const handleClearStatus = useCallback(() => {
    clearStatus.mutate(undefined, {
      onSuccess: () => setShowClearConfirm(false),
    });
  }, [clearStatus]);

  const toggleSystem = useCallback((system: string) => {
    setAffectedSystems((prev) =>
      prev.includes(system)
        ? prev.filter((s) => s !== system)
        : [...prev, system]
    );
  }, []);

  const statusInfo = status
    ? getStatusInfo(status.level)
    : getStatusInfo("operational");
  const StatusIcon = statusInfo.icon;
  const isStatusSet =
    status &&
    (status.level !== "operational" ||
      status.message ||
      status.isManualOverride);

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Bot Status"
        description="Manage the bot's status display (owner only)"
      />

      <div className="space-y-6">
        {/* Current Status Card */}
        <Card className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                <div>
                  <h3 className="text-lg font-semibold">{statusInfo.label}</h3>
                  {status?.message && (
                    <p className="text-sm text-muted-foreground">
                      {status.message}
                    </p>
                  )}
                </div>
              </div>

              {status?.affectedSystems && status.affectedSystems.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Affected Systems
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {status.affectedSystems.map((sys) => (
                      <span
                        key={sys}
                        className="px-2 py-0.5 rounded-full bg-muted text-xs"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {status?.estimatedResolution && (
                <div className="text-sm">
                  <CountdownTimer target={status.estimatedResolution} />
                </div>
              )}

              {status?.isManualOverride && (
                <p className="text-xs text-muted-foreground">
                  Manual override
                  {status.setBy ? ` by ${status.setBy}` : ""}
                  {status.setAt
                    ? ` at ${new Date(status.setAt).toLocaleString()}`
                    : ""}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Set Status Form */}
        <ConfigSection
          title="Set Status"
          description="Update the bot's status display"
        >
          <Select
            value={level}
            onChange={(v) => setLevel(v as StatusLevel)}
            options={STATUS_LEVELS.map((s) => ({
              value: s.value,
              label: s.label,
              description: s.description,
            }))}
            label="Status Level"
            disabled={setStatus.isPending}
          />

          <div>
            <label
              htmlFor={messageId}
              className="text-sm font-medium mb-1.5 block"
            >
              Status Message
            </label>
            <EmojiTextarea
              id={messageId}
              value={message}
              onChange={setMessage}
              placeholder="Describe the current status..."
              rows={3}
              disabled={setStatus.isPending}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Affected Systems</p>
            <div className="flex flex-wrap gap-2">
              {SYSTEMS.map((sys) => (
                <label
                  key={sys}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={affectedSystems.includes(sys)}
                    onChange={() => toggleSystem(sys)}
                    disabled={setStatus.isPending}
                    className="rounded"
                  />
                  <span className="text-sm">{sys}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor={resolutionId}
              className="text-sm font-medium mb-1.5 block"
            >
              Estimated Resolution{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <input
              id={resolutionId}
              type="datetime-local"
              value={estimatedResolution}
              onChange={(e) => setEstimatedResolution(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={setStatus.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              When do you expect this to be resolved?
            </p>
          </div>
        </ConfigSection>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setShowSetConfirm(true)}
            disabled={setStatus.isPending}
          >
            {setStatus.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Set Status"
            )}
          </Button>
          {isStatusSet && (
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
              disabled={clearStatus.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Status
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showSetConfirm}
        onOpenChange={setShowSetConfirm}
        title="Set Bot Status"
        description={`Set bot status to "${getStatusInfo(level).label}"?`}
        confirmLabel="Set Status"
        onConfirm={handleSetStatus}
        isLoading={setStatus.isPending}
      />

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear Status"
        description="Clear the current status? This will set all systems to operational."
        confirmLabel="Clear"
        variant="destructive"
        onConfirm={handleClearStatus}
        isLoading={clearStatus.isPending}
      />
    </FadeIn>
  );
}
