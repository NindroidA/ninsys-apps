import { useBaitChannelStats } from "@/hooks/useBaitChannel";
import { Card } from "@ninsys/ui/components";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BaitStatsTabProps {
  guildId: string;
}

const ACTION_COLORS: Record<string, string> = {
  ban: "#ef4444",
  kick: "#f97316",
  mute: "#eab308",
  warn: "#3b82f6",
};

const TIME_RANGES = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function StatCard({
  label,
  value,
  loading,
  highlight,
}: {
  label: string;
  value: string | number;
  loading?: boolean;
  highlight?: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-4 w-20 rounded bg-muted mb-2" />
        <div className="h-7 w-16 rounded bg-muted" />
      </Card>
    );
  }
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </p>
    </Card>
  );
}

function SkeletonChart() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="h-5 w-40 rounded bg-muted mb-4" />
      <div className="h-48 rounded bg-muted" />
    </Card>
  );
}

export function BaitStatsTab({ guildId }: BaitStatsTabProps) {
  const [days, setDays] = useState(30);
  const { data: stats, isLoading } = useBaitChannelStats(guildId, days);

  const pieData = useMemo(() => {
    if (!stats?.actionBreakdown) return [];
    return Object.entries(stats.actionBreakdown).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats?.actionBreakdown]);

  const mostCommonAction = useMemo(() => {
    if (pieData.length === 0) return "—";
    const sorted = [...pieData].sort((a, b) => b.value - a.value);
    return sorted[0]?.name ?? "—";
  }, [pieData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard key="sk-1" label="" value="" loading />
          <StatCard key="sk-2" label="" value="" loading />
          <StatCard key="sk-3" label="" value="" loading />
          <StatCard key="sk-4" label="" value="" loading />
        </div>
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No statistics available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {TIME_RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={`Total Detections (${days}d)`}
          value={stats.totalDetections30d ?? 0}
        />
        <StatCard
          label="Avg Suspicion Score"
          value={Math.round(stats.averageSuspicionScore ?? 0)}
        />
        <StatCard
          label="Override Rate"
          value={
            stats.overrideRate != null
              ? `${(stats.overrideRate * 100).toFixed(1)}%`
              : stats.falsePositiveRate != null
              ? `${(stats.falsePositiveRate * 100).toFixed(1)}%`
              : "—"
          }
        />
        <StatCard label="Most Common Action" value={mostCommonAction} />
      </div>

      {/* Action Breakdown Pie Chart */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Action Breakdown</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label={(props) =>
                  `${String(props.name ?? "")} (${(
                    ((props.percent as number | undefined) ?? 0) * 100
                  ).toFixed(0)}%)`
                }
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={ACTION_COLORS[entry.name] ?? "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No action data to display
          </p>
        )}
      </Card>

      {/* Score Distribution Histogram */}
      {stats.scoreDistribution && stats.scoreDistribution.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.scoreDistribution}>
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="oklch(0.55 0.20 280)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top Detection Flags */}
      {stats.topFlags && stats.topFlags.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Top Detection Flags</h3>
          <div className="space-y-2">
            {(() => {
              const maxCount = Math.max(...stats.topFlags.map((f) => f.count));
              return stats.topFlags.map((flag) => {
                const pct = maxCount > 0 ? (flag.count / maxCount) * 100 : 0;
                return (
                  <div key={flag.flag} className="flex items-center gap-3">
                    <span className="text-sm w-40 truncate">{flag.flag}</span>
                    <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/40 rounded-full transition-[width]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums w-10 text-right">
                      {flag.count}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </Card>
      )}

      {/* Detections by Day Chart */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">Detections by Day</h3>
        {(stats.detectionsByDay?.length ?? 0) > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.detectionsByDay}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(d: string) =>
                  new Date(d).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                labelFormatter={(d) => new Date(String(d)).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="oklch(0.55 0.12 240)"
                fill="oklch(0.55 0.20 280 / 0.2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No detection data to display
          </p>
        )}
      </Card>
    </div>
  );
}
