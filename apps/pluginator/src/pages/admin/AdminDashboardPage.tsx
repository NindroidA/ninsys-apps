/**
 * Admin Dashboard - Overview page
 */

import { useAdminOverview } from "@/hooks/useAdmin";
import { TIER_DISPLAY } from "@/types/tier";
import { FadeIn } from "@ninsys/ui/components/animations";
import { formatDistanceToNow } from "date-fns";
import { Activity, Loader2, Monitor, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  const { data: overview, isLoading, error } = useAdminOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading admin overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Failed to load admin overview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
      </FadeIn>

      {/* Stats Cards */}
      <FadeIn delay={0.1}>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              label: "Total Users",
              value: overview?.totalUsers ?? 0,
              icon: Users,
            },
            {
              label: "Active Subscriptions",
              value: overview?.activeSubscriptions ?? 0,
              icon: TrendingUp,
            },
            {
              label: "Active Sessions",
              value: overview?.activeSessions ?? 0,
              icon: Monitor,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="rounded-lg p-2 bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Recent Tier Changes */}
      <FadeIn delay={0.15}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Recent Tier Changes</h2>
            </div>
            <Link
              to="/admin/tier-history"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {!overview?.recentTierChanges?.length ? (
            <p className="text-sm text-muted-foreground py-4">
              No recent tier changes.
            </p>
          ) : (
            <div className="space-y-3">
              {overview.recentTierChanges.slice(0, 5).map((change) => (
                <div
                  key={change.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {change.userEmail || change.userId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {TIER_DISPLAY[
                        change.previousTier as keyof typeof TIER_DISPLAY
                      ]?.name ?? change.previousTier}
                      {" → "}
                      {TIER_DISPLAY[change.newTier as keyof typeof TIER_DISPLAY]
                        ?.name ?? change.newTier}
                      {change.reason && ` — ${change.reason}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(change.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Recent Audit Log */}
      <FadeIn delay={0.2}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Recent Admin Actions</h2>
            </div>
            <Link
              to="/admin/audit-log"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {!overview?.recentAuditLog?.length ? (
            <p className="text-sm text-muted-foreground py-4">
              No recent admin actions.
            </p>
          ) : (
            <div className="space-y-3">
              {overview.recentAuditLog.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {entry.adminEmail}
                      {entry.targetUserEmail && ` on ${entry.targetUserEmail}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(entry.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
