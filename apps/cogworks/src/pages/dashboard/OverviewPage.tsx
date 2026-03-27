import { StatCard } from "@/components/cogworks/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useRecentActivity } from "@/hooks/useAuditLog";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { useOverview } from "@/hooks/useOverview";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSetupState } from "@/hooks/useSetup";
import type { SystemState } from "@/types/setup";
import { Card } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Brain,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Megaphone,
  ScrollText,
  ShieldAlert,
  Smile,
  Ticket,
  XCircle,
} from "lucide-react";
import { type ComponentType, useMemo } from "react";
import { Link } from "react-router-dom";

interface SystemStatusItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  configured: boolean;
}

function StatusBadge({
  configured,
  state,
}: {
  configured: boolean;
  state?: SystemState;
}) {
  // Use setup state if available, fall back to configured boolean
  const effectiveState = state ?? (configured ? "complete" : "not_started");

  if (effectiveState === "complete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/10 text-green-500 px-2.5 py-0.5 text-xs font-medium border border-green-500/20">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }
  if (effectiveState === "partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500/15 to-amber-500/10 text-yellow-500 px-2.5 py-0.5 text-xs font-medium border border-yellow-500/20">
        <Activity className="h-3 w-3" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-500/15 to-slate-400/10 text-slate-400 px-2.5 py-0.5 text-xs font-medium border border-slate-500/20">
      <XCircle className="h-3 w-3" />
      Not Configured
    </span>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 animate-pulse",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-16 rounded bg-muted" />
        </div>
        <div className="h-12 w-12 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function SkeletonSystemCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
        </div>
        <div className="h-5 w-24 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function formatAction(action: string): string {
  return action
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function RecentActivitySection({ guildId }: { guildId: string }) {
  const { data: activity, isLoading } = useRecentActivity(guildId);

  return (
    <section className="mb-8">
      <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
        Recent Activity
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skel-activity-${i}`}
              className="rounded-lg border border-border bg-card p-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-48 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !activity?.length ? (
        <Card className="p-6 text-center">
          <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No recent activity from the dashboard yet
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {activity.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border bg-card p-3 flex items-center gap-3"
            >
              <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {formatAction(entry.action)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.triggeredBy} &middot;{" "}
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground shrink-0">
                {entry.source}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Map system keys to setup state IDs
const SYSTEM_STATE_MAP: Record<string, string> = {
  tickets: "ticket",
  applications: "application",
  announcements: "announcement",
  memory: "memory",
  rules: "rules",
  reactionRoles: "reactionRole",
  baitChannel: "baitchannel",
};

export function OverviewPage() {
  const { guild, guildId } = useCurrentGuild();
  const { data: overview, isLoading } = useOverview(guildId);
  const { data: setupState } = useSetupState(guildId);
  usePageTitle("Dashboard");

  const sys = overview?.systems;

  const systems = useMemo<SystemStatusItem[]>(
    () => [
      {
        key: "tickets",
        label: "Tickets",
        icon: Ticket,
        path: "tickets",
        configured: sys?.tickets?.configured ?? false,
      },
      {
        key: "applications",
        label: "Applications",
        icon: FileText,
        path: "applications",
        configured: sys?.applications?.configured ?? false,
      },
      {
        key: "announcements",
        label: "Announcements",
        icon: Megaphone,
        path: "announcements",
        configured: sys?.announcements?.configured ?? false,
      },
      {
        key: "memory",
        label: "Memory",
        icon: Brain,
        path: "memory",
        configured: sys?.memory?.configured ?? false,
      },
      {
        key: "rules",
        label: "Rules",
        icon: ScrollText,
        path: "rules",
        configured: sys?.rules?.configured ?? false,
      },
      {
        key: "reactionRoles",
        label: "Reaction Roles",
        icon: Smile,
        path: "reaction-roles",
        configured: sys?.reactionRoles?.configured ?? false,
      },
      {
        key: "baitChannel",
        label: "Bait Channel",
        icon: ShieldAlert,
        path: "bait-channel",
        configured: sys?.baitChannel?.configured ?? false,
      },
    ],
    [sys]
  );

  return (
    <FadeIn>
      <PageHeader
        title="Dashboard"
        description={guild?.name ? `Overview for ${guild.name}` : undefined}
      />

      {/* Stats Grid */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Quick Stats
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`skel-stat-${i}`} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StatCard
              label="Active Tickets"
              value={sys?.tickets?.activeCount ?? 0}
              icon={Ticket}
            />
            <StatCard
              label="Pending Applications"
              value={sys?.applications?.activeCount ?? 0}
              icon={FileText}
            />
            <StatCard
              label="Memory Items"
              value={sys?.memory?.itemCount ?? 0}
              icon={Brain}
            />
            <StatCard
              label="Reaction Menus"
              value={sys?.reactionRoles?.menuCount ?? 0}
              icon={Smile}
            />
          </StaggerContainer>
        )}
      </section>

      {/* System Status Grid */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Systems
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonSystemCard key={`skel-sys-${i}`} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systems.map((system) => {
              const Icon = system.icon;
              return (
                <Link
                  key={system.key}
                  to={system.path}
                  className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{system.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        configured={system.configured}
                        state={
                          setupState?.systemStates?.[
                            SYSTEM_STATE_MAP[
                              system.key
                            ] as keyof typeof setupState.systemStates
                          ]
                        }
                      />
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </StaggerContainer>
        )}
      </section>

      {/* Recent Activity */}
      <RecentActivitySection guildId={guildId} />

      {/* Role Summary */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Role Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff Roles</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <span className="inline-block h-7 w-8 rounded bg-muted animate-pulse" />
                  ) : (
                    overview?.roles?.staffCount ?? 0
                  )}
                </p>
              </div>
              <Link to="roles" className="text-sm text-primary hover:underline">
                Manage
              </Link>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin Roles</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? (
                    <span className="inline-block h-7 w-8 rounded bg-muted animate-pulse" />
                  ) : (
                    overview?.roles?.adminCount ?? 0
                  )}
                </p>
              </div>
              <Link to="roles" className="text-sm text-primary hover:underline">
                Manage
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </FadeIn>
  );
}
