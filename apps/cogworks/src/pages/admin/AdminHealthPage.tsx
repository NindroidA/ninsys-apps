import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminHealth } from "@/hooks/useAdmin";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Database, Globe, Server } from "lucide-react";
import type { ComponentType } from "react";

function statusColor(status: string | undefined): string {
  if (!status) return "text-muted-foreground";
  const s = status.toLowerCase();
  if (s === "healthy" || s === "online" || s === "ok" || s === "connected")
    return "text-green-500";
  if (s === "degraded" || s === "slow") return "text-yellow-500";
  return "text-red-500";
}

function statusDot(status: string | undefined): string {
  if (!status) return "bg-muted-foreground";
  const s = status.toLowerCase();
  if (s === "healthy" || s === "online" || s === "ok" || s === "connected")
    return "bg-green-500";
  if (s === "degraded" || s === "slow") return "bg-yellow-500";
  return "bg-red-500";
}

function HealthCard({
  title,
  icon: Icon,
  status,
  metrics,
  loading,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  status?: string;
  metrics: { label: string; value: string | number }[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="h-5 w-32 rounded bg-muted mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold flex-1">{title}</h3>
        {status && (
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", statusDot(status))} />
            <span
              className={cn(
                "text-xs font-medium capitalize",
                statusColor(status)
              )}
            >
              {status}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-medium">{m.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminHealthPage() {
  usePageTitle("System Health — Admin");
  const { data: health, isLoading } = useAdminHealth();

  return (
    <FadeIn>
      <PageHeader
        title="System Health"
        description="API, bot, and database health monitoring"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-5xl">
        <HealthCard
          title="API"
          icon={Globe}
          status={health?.api?.status}
          loading={isLoading}
          metrics={[
            {
              label: "Response Time",
              value:
                health?.api?.responseTimeMs != null
                  ? `${health.api.responseTimeMs}ms`
                  : "—",
            },
          ]}
        />
        <HealthCard
          title="Bot"
          icon={Server}
          status={health?.bot?.status}
          loading={isLoading}
          metrics={[
            {
              label: "Gateway Latency",
              value:
                health?.bot?.gatewayLatency != null
                  ? `${health.bot.gatewayLatency}ms`
                  : "—",
            },
            {
              label: "Shards",
              value: health?.bot?.shardCount ?? "—",
            },
          ]}
        />
        <HealthCard
          title="Database"
          icon={Database}
          status={health?.database?.status}
          loading={isLoading}
          metrics={[
            {
              label: "Pool Size",
              value: health?.database?.poolSize ?? "—",
            },
            {
              label: "Active Connections",
              value: health?.database?.activeConnections ?? "—",
            },
          ]}
        />
      </div>
    </FadeIn>
  );
}
