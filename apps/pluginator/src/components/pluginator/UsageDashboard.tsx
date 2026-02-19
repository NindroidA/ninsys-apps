/**
 * Usage Dashboard Component
 * Displays daily usage statistics, plan info, and subscription management
 */

import { SubscriptionBadge } from "@/components/pluginator/SubscriptionBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { isValidStripeUrl } from "@/lib/stripe";
import {
  useCancelSubscription,
  useCreatePortalSession,
  useReactivateSubscription,
  useSubscription,
} from "@/hooks/useSubscription";
import { useUsage } from "@/hooks/useUsage";
import { TIER_DISPLAY, getTierLevel, type UsageStat } from "@/types/tier";
import { Button, Card } from "@ninsys/ui/components";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UsageDashboard() {
  const { data: usage, isLoading: usageLoading } = useUsage();
  const { data: subscription } = useSubscription();
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();
  const createPortalSession = useCreatePortalSession();
  const navigate = useNavigate();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  if (usageLoading || !usage) {
    return <UsageSkeleton />;
  }

  // Use subscription tier as source of truth, fall back to usage tier
  const effectiveTier = subscription?.tier ?? usage.tier;
  const currentLevel = getTierLevel(effectiveTier);
  const tierInfo = TIER_DISPLAY[effectiveTier];
  const status = subscription?.status;
  const hasPlusDiscount = subscription?.hasPlusDiscount ?? false;
  const fallbackTier = hasPlusDiscount ? "Plus" : "Free";
  // Pro/Max are subscription tiers (level >= 2)
  const hasSubscription = currentLevel >= 2;
  const isCanceling =
    status === "canceling" || subscription?.cancelAtPeriodEnd === true;
  const isPastDue = status === "past_due";

  const periodEndDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const data = await createPortalSession.mutateAsync();
      if (isValidStripeUrl(data.url)) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      // Error handled by mutation state
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleCancelConfirm() {
    try {
      await cancelSubscription.mutateAsync();
      setShowCancelDialog(false);
    } catch {
      // Error state tracked by React Query
    }
  }

  async function handleReactivate() {
    try {
      await reactivateSubscription.mutateAsync();
    } catch {
      // Error state tracked by React Query
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Tier + Subscription Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Plan</h3>
            {hasPlusDiscount && effectiveTier !== "plus" && (
              <p className="text-sm text-success">Plus discount applied</p>
            )}
          </div>
          <SubscriptionBadge tier={effectiveTier} />
        </div>

        {/* Subscription Management */}
        <div className="mt-4 pt-4 border-t border-border">
          {/* Free tier (no Plus) */}
          {currentLevel === 0 && !hasPlusDiscount && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You're on the Free plan. Upgrade to unlock more features.
              </p>
              <Button size="sm" onClick={() => navigate("/pricing")}>
                Upgrade Plan
              </Button>
            </div>
          )}

          {/* Free with Plus discount (no active subscription) */}
          {currentLevel === 0 && hasPlusDiscount && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You're on the Free plan with Plus discounts available. Subscribe
                to Pro or Max at a reduced rate.
              </p>
              <Button size="sm" onClick={() => navigate("/pricing")}>
                View Plans
              </Button>
            </div>
          )}

          {/* Plus only (no subscription) */}
          {effectiveTier === "plus" && !hasSubscription && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your Plus purchase is active. Subscribe to Pro or Max for even
                more power.
              </p>
              <Button size="sm" onClick={() => navigate("/pricing")}>
                View Plans
              </Button>
            </div>
          )}

          {/* Pro/Max subscription — past due */}
          {hasSubscription && isPastDue && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-500">Payment failed</p>
                    <p className="text-muted-foreground">
                      Please update your payment method to keep your{" "}
                      {tierInfo?.name} plan active.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleManageBilling}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                )}
                Update Payment Method
              </Button>
            </div>
          )}

          {/* Pro/Max subscription — canceling */}
          {hasSubscription && isCanceling && !isPastDue && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-500">
                      Subscription ending
                    </p>
                    <p className="text-muted-foreground">
                      Your {tierInfo?.name} plan will remain active until{" "}
                      <span className="font-medium text-foreground">
                        {periodEndDate}
                      </span>
                      . After that, you'll be on the {fallbackTier} plan.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReactivate}
                disabled={reactivateSubscription.isPending}
              >
                {reactivateSubscription.isPending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                )}
                Reactivate Subscription
              </Button>
            </div>
          )}

          {/* Pro/Max subscription — active (normal state, not canceling or past due) */}
          {hasSubscription && !isCanceling && !isPastDue && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                {subscription?.priceFormatted && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>{subscription.priceFormatted}/month</span>
                  </div>
                )}
                {periodEndDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Next billing: {periodEndDate}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                >
                  Change Plan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Manage Billing
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Usage Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <UsageCard
          title="Update Checks"
          icon={<Zap className="h-4 w-4" />}
          stat={usage.today.checks}
        />
        <UsageCard
          title="Downloads"
          icon={<Download className="h-4 w-4" />}
          stat={usage.today.downloads}
        />
        <UsageCard
          title="Syncs"
          icon={<RefreshCw className="h-4 w-4" />}
          stat={usage.today.syncs}
        />
      </div>

      {/* Low Usage Warning */}
      {(isLowUsage(usage.today.checks) ||
        isLowUsage(usage.today.downloads) ||
        isLowUsage(usage.today.syncs)) && (
        <Card className="p-4 border-warning/50 bg-warning/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning">
              You're running low on daily usage. Consider upgrading for higher
              limits.
            </p>
          </div>
        </Card>
      )}

      {/* Cancel Subscription Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Subscription?"
        description={`Your ${
          tierInfo?.name ?? "current"
        } plan will remain active until ${
          periodEndDate ?? "the end of your billing period"
        }. After that, you'll be downgraded to the ${fallbackTier} plan.`}
        confirmText="Cancel Subscription"
        cancelText="Keep Subscription"
        loading={cancelSubscription.isPending}
        destructive
      />
    </div>
  );
}

interface UsageCardProps {
  title: string;
  icon: React.ReactNode;
  stat: UsageStat;
}

function UsageCard({ title, icon, stat }: UsageCardProps) {
  const isUnlimited = stat.limit === -1;
  const percentage = isUnlimited ? 0 : (stat.used / stat.limit) * 100;
  const isWarning = !isUnlimited && percentage >= 80;
  const isDanger = !isUnlimited && percentage >= 100;

  return (
    <Card
      className={`p-4 ${
        isDanger
          ? "border-destructive/50"
          : isWarning
          ? "border-warning/50"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {stat.used}
        <span className="text-muted-foreground text-sm font-normal">
          {isUnlimited ? " / Unlimited" : ` / ${stat.limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="mt-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isDanger
                  ? "bg-destructive"
                  : isWarning
                  ? "bg-warning"
                  : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {isUnlimited ? "No limit" : `${stat.remaining} remaining today`}
      </p>
    </Card>
  );
}

function isLowUsage(stat: UsageStat): boolean {
  if (stat.limit === -1) return false;
  return stat.remaining <= Math.ceil(stat.limit * 0.2);
}

function UsageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-muted rounded-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
