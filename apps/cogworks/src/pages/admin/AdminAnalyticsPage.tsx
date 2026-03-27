import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TIME_RANGES = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const SYSTEM_COLORS: Record<string, string> = {
  tickets: "#3b82f6",
  applications: "#8b5cf6",
  announcements: "#f59e0b",
  memory: "#10b981",
  rules: "#06b6d4",
  "reaction-roles": "#ec4899",
  "bait-channel": "#ef4444",
  roles: "#6366f1",
};

function getSystemColor(system: string): string {
  return SYSTEM_COLORS[system] ?? "#6b7280";
}

export function AdminAnalyticsPage() {
  usePageTitle("Analytics — Admin");
  const [days, setDays] = useState(30);
  const { data: analytics, isLoading } = useAdminAnalytics(days);

  const totalCommands = useMemo(
    () => analytics?.commandUsage?.reduce((sum, c) => sum + c.count, 0) ?? 0,
    [analytics?.commandUsage]
  );

  const totalServersConfigured = useMemo(
    () =>
      analytics?.systemUsage?.reduce((sum, s) => sum + s.configuredCount, 0) ??
      0,
    [analytics?.systemUsage]
  );

  if (isLoading) {
    return (
      <FadeIn>
        <PageHeader
          title="Analytics"
          description="Bot-wide usage trends and metrics"
        />
        <div className="space-y-6 max-w-5xl animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-20 rounded-lg bg-muted" />
            <div className="h-20 rounded-lg bg-muted" />
            <div className="h-20 rounded-lg bg-muted" />
          </div>
          <div className="h-72 rounded-lg bg-muted" />
          <div className="h-72 rounded-lg bg-muted" />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <PageHeader
        title="Analytics"
        description="Bot-wide usage trends and metrics"
      />

      <div className="space-y-6 max-w-5xl">
        {/* Time range + summary stats */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold">
                {totalCommands.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Total commands ({days}d)
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold">{totalServersConfigured}</p>
              <p className="text-xs text-muted-foreground">
                System configurations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
            {TIME_RANGES.map((r) => (
              <button
                key={r.days}
                type="button"
                onClick={() => setDays(r.days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  days === r.days
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {!analytics ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        ) : (
          <>
            {/* Server Growth */}
            {(analytics.serverGrowth?.length ?? 0) > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-1">Server Growth</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Servers joined vs left over time
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.serverGrowth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      tickFormatter={(d: string) =>
                        new Date(d).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="joined"
                      stroke="#22c55e"
                      fill="rgba(34, 197, 94, 0.12)"
                      strokeWidth={2}
                      name="Joined"
                    />
                    <Area
                      type="monotone"
                      dataKey="left"
                      stroke="#ef4444"
                      fill="rgba(239, 68, 68, 0.08)"
                      strokeWidth={2}
                      name="Left"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Two-column: Commands + System Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Commands */}
              {(analytics.commandUsage?.length ?? 0) > 0 && (
                <Card className="p-6">
                  <h3 className="text-sm font-semibold mb-1">Top Commands</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Most used slash commands
                  </p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={analytics.commandUsage.slice(0, 8)}
                      layout="vertical"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="command"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.7)" }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Uses">
                        {analytics.commandUsage.slice(0, 8).map((_, i) => (
                          <Cell
                            key={`cmd-${i}`}
                            fill={`oklch(0.65 0.16 ${220 + i * 15})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* System Adoption */}
              {(analytics.systemUsage?.length ?? 0) > 0 && (
                <Card className="p-6">
                  <h3 className="text-sm font-semibold mb-1">
                    System Adoption
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Servers with each system configured
                  </p>
                  <div className="space-y-3">
                    {analytics.systemUsage.map((sys) => {
                      const maxCount = Math.max(
                        ...analytics.systemUsage.map((s) => s.configuredCount)
                      );
                      const pct =
                        maxCount > 0
                          ? (sys.configuredCount / maxCount) * 100
                          : 0;
                      const color = getSystemColor(sys.system);
                      return (
                        <div key={sys.system} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm capitalize">
                              {sys.system.replace("-", " ")}
                            </span>
                            <span className="text-sm font-medium tabular-nums">
                              {sys.configuredCount}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-[width] duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            {/* Error Rate */}
            {(analytics.errorRate?.length ?? 0) > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-1">Error Rate</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  API and bot errors over time
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics.errorRate}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      tickFormatter={(d: string) =>
                        new Date(d).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#ef4444"
                      fill="rgba(239, 68, 68, 0.1)"
                      strokeWidth={2}
                      name="Errors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
          </>
        )}
      </div>
    </FadeIn>
  );
}
