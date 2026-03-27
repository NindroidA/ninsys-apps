import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminHealth, useAdminOverview } from "@/hooks/useAdmin";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Activity, Clock, Cpu, Server, Terminal, Zap } from "lucide-react";
import type { ComponentType } from "react";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  loading?: boolean;
  accent?: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div>
            <div className="h-6 w-16 rounded bg-muted mb-1" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className={cn("p-5", accent && "border-primary/20")}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center",
            accent
              ? "bg-gradient-to-br from-primary/20 to-accent/10"
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn("h-5 w-5", accent ? "text-primary" : "text-primary")}
          />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function statusDot(status: string | undefined): string {
  if (!status) return "bg-muted-foreground";
  const s = status.toLowerCase();
  if (s === "healthy" || s === "online" || s === "ok" || s === "connected")
    return "bg-green-500";
  if (s === "degraded" || s === "slow") return "bg-yellow-500";
  return "bg-red-500";
}

export function AdminDashboardPage() {
  usePageTitle("Super Admin");
  const { data: overview, isLoading } = useAdminOverview();
  const { data: health } = useAdminHealth();

  return (
    <FadeIn>
      <PageHeader
        title="Super Admin Dashboard"
        description="Bot-wide overview and management"
      />

      <div className="space-y-6 max-w-5xl">
        {!isLoading && !overview && (
          <Card className="p-4 border-amber-500/30 bg-amber-500/5">
            <p className="text-sm text-amber-300">
              Unable to load admin data. Make sure{" "}
              <code className="font-mono text-xs bg-amber-500/10 px-1 py-0.5 rounded">
                COGWORKS_BOT_OWNER_ID
              </code>{" "}
              is set in the API environment and matches your Discord user ID.
            </p>
          </Card>
        )}

        {/* Primary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Servers"
            value={overview?.serverCount ?? "—"}
            icon={Server}
            loading={isLoading}
            accent
          />
          <StatCard
            label="Commands (24h)"
            value={overview?.commandsRun24h?.toLocaleString() ?? "—"}
            icon={Terminal}
            loading={isLoading}
          />
          <StatCard
            label="Uptime"
            value={overview ? formatUptime(overview.uptimeSeconds) : "—"}
            icon={Clock}
            loading={isLoading}
          />
        </div>

        {/* Performance stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Gateway Latency"
            value={
              overview?.latencyMs != null ? `${overview.latencyMs}ms` : "—"
            }
            icon={Zap}
            loading={isLoading}
          />
          <StatCard
            label="Memory Usage"
            value={
              overview?.memoryUsageMb != null
                ? `${Math.round(overview.memoryUsageMb)}MB`
                : "—"
            }
            icon={Cpu}
            loading={isLoading}
          />
          <StatCard
            label="Bot Version"
            value={overview?.botVersion ?? "—"}
            icon={Activity}
            loading={isLoading}
          />
        </div>

        {/* Quick health status */}
        {health && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">System Status</h3>
            <div className="flex items-center gap-6">
              {[
                { label: "API", status: health.api?.status },
                { label: "Bot", status: health.bot?.status },
                { label: "Database", status: health.database?.status },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className={cn("h-2 w-2 rounded-full", statusDot(s.status))}
                  />
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {s.status ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </FadeIn>
  );
}
