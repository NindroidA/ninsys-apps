import { ConfigSection } from "@/components/forms/ConfigSection";
import { StatusToggle } from "@/components/forms/StatusToggle";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSlaConfig, useUpdateSlaConfig, useSlaStats } from "@/hooks/useSla";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Badge, Card } from "@ninsys/ui/components";
import { AlertTriangle, CheckCircle, Clock, ShieldCheck } from "lucide-react";

function TabFallback() {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function SlaPage() {
  const { guildId } = useCurrentGuild();
  usePageTitle("Ticket SLA");

  const { data: config, isLoading: configLoading } = useSlaConfig(guildId);
  const updateConfig = useUpdateSlaConfig(guildId);
  const { data: stats, isLoading: statsLoading } = useSlaStats(guildId);

  if (configLoading) return <TabFallback />;

  return (
    <FadeIn className="max-w-4xl">
      <PageHeader
        title="Ticket SLA"
        description="Configure service level agreements for ticket response times"
      />

      <div className="space-y-6">
        {!configLoading && !config && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              SLA tracking is not configured yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This feature requires the ticket workflow to be enabled first.
            </p>
            <a
              href={`tickets?tab=config`}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
            >
              Go to Ticket Settings →
            </a>
          </div>
        )}
        {config && (
          <>
            <StatusToggle
              enabled={config.enabled}
              onChange={(enabled) => updateConfig.mutate({ enabled })}
              label="SLA Tracking"
              description="Enable response time tracking and breach alerts"
              disabled={updateConfig.isPending}
            />

            <ConfigSection
              title="SLA Configuration"
              description="Set target response times"
            >
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Target First Response Time (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={config.targetResponseMinutes}
                  onChange={(e) =>
                    updateConfig.mutate({
                      targetResponseMinutes:
                        Number.parseInt(e.target.value, 10) || 60,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <ChannelPicker
                guildId={guildId}
                value={config.breachAlertChannelId}
                onChange={(channelId) =>
                  updateConfig.mutate({ breachAlertChannelId: channelId })
                }
                filter="text"
                label="Breach Alert Channel"
                placeholder="Select alert channel"
                clearable
              />
            </ConfigSection>

            {/* Per-Type Overrides */}
            <ConfigSection
              title="Per-Type Overrides"
              description="Custom SLA targets for specific ticket types"
            >
              {config.perTypeOverrides.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No per-type overrides configured. All ticket types use the
                  default target of {config.targetResponseMinutes} minutes.
                </p>
              ) : (
                <div className="space-y-2">
                  {config.perTypeOverrides.map((override) => (
                    <div
                      key={override.typeId}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                    >
                      <span className="text-sm font-medium">
                        {override.typeName}
                      </span>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {override.minutes}m
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ConfigSection>
          </>
        )}

        {/* Stats */}
        {!statsLoading && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(stats.averageFirstResponseMinutes)}m
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Response Time
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(stats.complianceRate)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Compliance Rate
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.breachCount}</p>
                    <p className="text-sm text-muted-foreground">
                      SLA Breaches
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {stats.trending.length > 0 && (
              <ConfigSection
                title="Compliance Trend"
                description="SLA compliance over the last 30 days"
              >
                <div className="space-y-2">
                  {stats.trending.slice(-7).map((point) => (
                    <div
                      key={point.date}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {point.date}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {Math.round(point.compliance)}%
                        </span>
                        {point.breaches > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            {point.breaches}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ConfigSection>
            )}
          </>
        )}
      </div>
    </FadeIn>
  );
}
