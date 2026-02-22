import { SubscriptionBadge } from "@/components/pluginator";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsage } from "@/hooks/useUsage";
import { Button } from "@ninsys/ui/components";
import { ParallaxElement, ScrollProgress } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import {
  Activity,
  CloudUpload,
  Download,
  Gauge,
  HardDrive,
  Puzzle,
  RefreshCw,
  Search,
  Server,
  TrendingUp,
} from "lucide-react";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { data: subscription } = useSubscription();
  const { data: usage, isLoading: usageLoading } = useUsage();

  // Usage stats from API
  const usageStats = usage
    ? [
        {
          label: "Checks Today",
          used: usage.today.updateChecks.used,
          limit: usage.today.updateChecks.limit,
          icon: Search,
        },
        {
          label: "Downloads Today",
          used: usage.today.downloads.used,
          limit: usage.today.downloads.limit,
          icon: Download,
        },
        {
          label: "Syncs Today",
          used: usage.today.syncs.used,
          limit: usage.today.syncs.limit,
          icon: CloudUpload,
        },
        {
          label: "Migrations Today",
          used: usage.today.migrations.used,
          limit: usage.today.migrations.limit,
          icon: RefreshCw,
        },
      ]
    : [];

  // Mock server stats - would come from CLI sync in future
  const serverStats = {
    servers: 0,
    plugins: 0,
    backups: 0,
    updatesAvailable: 0,
  };

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <ParallaxElement
          speed={0.08}
          className="absolute"
          style={{ top: "5%", right: "5%" }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="rounded-full blur-3xl"
            style={{
              width: "300px",
              height: "300px",
              background: "oklch(0.627 0.265 303.9 / 0.1)",
            }}
          />
        </ParallaxElement>
        <ParallaxElement
          speed={-0.05}
          className="absolute"
          style={{ bottom: "10%", left: "10%" }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="rounded-full blur-3xl"
            style={{
              width: "250px",
              height: "250px",
              background: "oklch(0.70 0.20 290 / 0.08)",
            }}
          />
        </ParallaxElement>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl font-bold"
              >
                Welcome back, {user?.name || user?.email?.split("@")[0]}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2 mt-1"
              >
                <span className="text-muted-foreground">Your plan:</span>
                <SubscriptionBadge
                  tier={subscription?.tier ?? user?.subscriptionTier ?? "free"}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button variant="outline" onClick={() => logout()}>
                Sign out
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Daily Usage Quota */}
        {!usageLoading && usage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Today's Usage</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {usageStats.map((stat, index) => {
                  const percentage =
                    stat.limit === -1
                      ? 0
                      : Math.min((stat.used / stat.limit) * 100, 100);
                  const isUnlimited = stat.limit === -1;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stat.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {stat.used} / {isUnlimited ? "∞" : stat.limit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            percentage > 90
                              ? "bg-destructive"
                              : percentage > 70
                              ? "bg-warning"
                              : "bg-primary"
                          }`}
                          initial={{ width: 0 }}
                          animate={{
                            width: isUnlimited ? "100%" : `${percentage}%`,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: 0.2 + index * 0.1,
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Server Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Servers", value: serverStats.servers, icon: Server },
            {
              label: "Plugins Tracked",
              value: serverStats.plugins,
              icon: Puzzle,
            },
            { label: "Backups", value: serverStats.backups, icon: HardDrive },
            {
              label: "Updates Available",
              value: serverStats.updatesAvailable,
              icon: RefreshCw,
              highlight: serverStats.updatesAvailable > 0,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className={`rounded-xl border ${
                stat.highlight ? "border-warning" : "border-border"
              } bg-card p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <motion.p
                    className="text-3xl font-bold mt-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`rounded-lg p-2 ${
                    stat.highlight ? "bg-warning/10" : "bg-primary/10"
                  }`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.highlight ? "text-warning" : "text-primary"
                    }`}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="rounded-xl border border-border bg-card p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  icon: RefreshCw,
                  label: "Check All Updates",
                  variant: "primary" as const,
                },
                {
                  icon: HardDrive,
                  label: "Create Backup",
                  variant: "outline" as const,
                },
                {
                  icon: Server,
                  label: "Add Server",
                  variant: "outline" as const,
                },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant={action.variant}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <ScrollProgress start="top 90%" end="top 50%">
          {({ progress }) => (
            <motion.div
              className="rounded-xl border border-border bg-card p-6"
              style={{
                opacity: Math.max(0.5, progress),
                transform: `translateY(${(1 - progress) * 20}px)`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Getting Started</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "1",
                    step: "1",
                    action: "Download Pluginator CLI",
                    detail:
                      "Get the CLI for your platform from the download page",
                  },
                  {
                    id: "2",
                    step: "2",
                    action: "Configure your plugins",
                    detail:
                      "Create a pluginator.toml file or use the CLI to add plugins",
                  },
                  {
                    id: "3",
                    step: "3",
                    action: "Check for updates",
                    detail: "Run 'pluginator check' to scan all your plugins",
                  },
                  {
                    id: "4",
                    step: "4",
                    action: "Update with confidence",
                    detail: "Apply updates safely with automatic backups",
                  },
                ].map((step, index) => {
                  const itemProgress = Math.max(
                    0,
                    Math.min(1, (progress - index * 0.1) * 2)
                  );
                  return (
                    <motion.div
                      key={step.id}
                      className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                      style={{
                        opacity: Math.max(0.4, itemProgress),
                        transform: `translateX(${(1 - itemProgress) * 20}px)`,
                      }}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {step.step}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{step.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </ScrollProgress>
      </div>
    </div>
  );
}
