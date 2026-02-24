/**
 * Admin User Detail page
 */

import { TwoFAVerifyDialog } from "@/components/admin/TwoFAVerifyDialog";
import { ROLE_COLORS } from "@/lib/constants";
import {
  useAdminChangeTier,
  useAdminChangeRole,
  useAdminDeactivateUser,
  useAdminRevokeSessions,
  useAdminUserDetail,
} from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { TIER_DISPLAY, TIER_HIERARCHY } from "@/types/tier";
import { Button, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  History,
  Loader2,
  Monitor,
  Shield,
  ShieldCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

export function AdminUserDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, error } = useAdminUserDetail(id);

  const changeTier = useAdminChangeTier();
  const changeRole = useAdminChangeRole();
  const deactivateUser = useAdminDeactivateUser();
  const revokeSessions = useAdminRevokeSessions();

  // Action state
  const [tierAction, setTierAction] = useState<{
    tier: string;
    reason: string;
  } | null>(null);
  const [roleAction, setRoleAction] = useState<string | null>(null);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showRevokeSessions, setShowRevokeSessions] = useState(false);
  const [actionError, setActionError] = useState("");

  // Tier change form
  const [selectedTier, setSelectedTier] = useState("");
  const [tierReason, setTierReason] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const isSuperAdmin = currentUser?.role === "super_admin";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">User not found.</p>
        <Link
          to="/admin/users"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <Link
          to="/admin/users"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>

        {/* User Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {user.name || user.username || user.email}
              </h1>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  ROLE_COLORS[user.role] ?? ROLE_COLORS.user
                )}
              >
                {user.role}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium border",
                user.isActive
                  ? "bg-success/10 text-success border-success/30"
                  : "bg-red-500/10 text-red-500 border-red-500/30"
              )}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
            {user.totpEnabled && (
              <span className="text-xs px-2 py-1 rounded-full font-medium border bg-blue-500/10 text-blue-500 border-blue-500/30">
                <ShieldCheck className="inline h-3 w-3 mr-1" />
                2FA
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Admin Actions */}
      {isSuperAdmin && (
        <FadeIn delay={0.1}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Admin Actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Change Tier */}
              <div className="space-y-2">
                <label
                  htmlFor="admin-change-tier"
                  className="text-sm font-medium"
                >
                  Change Tier
                </label>
                <div className="flex gap-2">
                  <select
                    id="admin-change-tier"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select tier...</option>
                    {TIER_HIERARCHY.map((t) => (
                      <option key={t} value={t}>
                        {TIER_DISPLAY[t].name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedTier && (
                  <>
                    <input
                      value={tierReason}
                      onChange={(e) => setTierReason(e.target.value)}
                      placeholder="Reason for change"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        setTierAction({
                          tier: selectedTier,
                          reason: tierReason,
                        })
                      }
                      disabled={!tierReason.trim()}
                    >
                      Apply Tier Change
                    </Button>
                  </>
                )}
              </div>

              {/* Change Role */}
              <div className="space-y-2">
                <label
                  htmlFor="admin-change-role"
                  className="text-sm font-medium"
                >
                  Change Role
                </label>
                <div className="flex gap-2">
                  <select
                    id="admin-change-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select role...</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {selectedRole && (
                    <Button
                      size="sm"
                      onClick={() => setRoleAction(selectedRole)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>

              {/* Deactivate */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Status</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                  onClick={() => setShowDeactivate(true)}
                  disabled={!user.isActive}
                >
                  <UserX className="mr-1 h-4 w-4" />
                  Deactivate Account
                </Button>
              </div>

              {/* Revoke Sessions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sessions</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRevokeSessions(true)}
                >
                  Revoke All Sessions
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Subscription History */}
      <FadeIn delay={0.15}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription History</h2>
          {!user.subscriptions?.length ? (
            <p className="text-sm text-muted-foreground py-2">
              No subscriptions.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                      Tier
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                      Stripe ID
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                      Period End
                    </th>
                    <th className="text-left py-2 font-medium text-muted-foreground">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.subscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 pr-4">
                        {TIER_DISPLAY[sub.tier]?.name ?? sub.tier}
                      </td>
                      <td className="py-2 pr-4 capitalize">{sub.status}</td>
                      <td className="py-2 pr-4 text-xs font-mono text-muted-foreground">
                        {sub.stripeSubscriptionId
                          ? sub.stripeSubscriptionId.slice(0, 20) + "..."
                          : "—"}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                        {sub.currentPeriodEnd
                          ? format(
                              new Date(sub.currentPeriodEnd),
                              "MMM d, yyyy"
                            )
                          : "—"}
                      </td>
                      <td className="py-2 text-muted-foreground whitespace-nowrap">
                        {format(new Date(sub.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Active Sessions */}
      <FadeIn delay={0.2}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Active Sessions</h2>
          </div>
          {!user.sessions?.length ? (
            <p className="text-sm text-muted-foreground py-2">
              No active sessions.
            </p>
          ) : (
            <div className="space-y-3">
              {user.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{session.deviceName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {session.authMethod === "pat" ? "Token" : "Browser"}
                      {" — "}
                      Active{" "}
                      {formatDistanceToNow(new Date(session.lastActiveAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {session.isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      current
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Tier History */}
      <FadeIn delay={0.25}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Tier Change History</h2>
          </div>
          {!user.tierHistory?.length ? (
            <p className="text-sm text-muted-foreground py-2">
              No tier changes.
            </p>
          ) : (
            <div className="space-y-3">
              {user.tierHistory.map((change) => (
                <div
                  key={change.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {TIER_DISPLAY[
                        change.previousTier as keyof typeof TIER_DISPLAY
                      ]?.name ?? change.previousTier}
                      {" → "}
                      {TIER_DISPLAY[change.newTier as keyof typeof TIER_DISPLAY]
                        ?.name ?? change.newTier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {change.reason}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(change.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Usage Stats */}
      <FadeIn delay={0.3}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Usage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Update Checks", value: user.usage?.updateChecks ?? 0 },
              { label: "Downloads", value: user.usage?.downloads ?? 0 },
              { label: "Syncs", value: user.usage?.syncs ?? 0 },
              { label: "Migrations", value: user.usage?.migrations ?? 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-lg bg-muted/50"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      {/* 2FA Verification Dialogs */}
      <TwoFAVerifyDialog
        open={!!tierAction}
        title="Confirm Tier Change"
        description={`Change tier to ${
          tierAction?.tier
            ? TIER_DISPLAY[tierAction.tier as keyof typeof TIER_DISPLAY]
                ?.name ?? tierAction.tier
            : ""
        }. Reason: ${tierAction?.reason || ""}`}
        confirmText="Change Tier"
        loading={changeTier.isPending}
        error={changeTier.isError ? changeTier.error.message : actionError}
        onConfirm={(code) => {
          setActionError("");
          changeTier.mutate(
            {
              userId: id,
              tier: tierAction!.tier,
              reason: tierAction!.reason,
              twoFACode: code,
            },
            {
              onSuccess: () => {
                setTierAction(null);
                setSelectedTier("");
                setTierReason("");
              },
              onError: (err) => setActionError(err.message),
            }
          );
        }}
        onCancel={() => {
          setTierAction(null);
          setActionError("");
        }}
      />

      <TwoFAVerifyDialog
        open={!!roleAction}
        title="Confirm Role Change"
        description={`Change role to ${roleAction || ""}.`}
        confirmText="Change Role"
        loading={changeRole.isPending}
        error={changeRole.isError ? changeRole.error.message : actionError}
        onConfirm={(code) => {
          setActionError("");
          changeRole.mutate(
            { userId: id, role: roleAction!, twoFACode: code },
            {
              onSuccess: () => {
                setRoleAction(null);
                setSelectedRole("");
              },
              onError: (err) => setActionError(err.message),
            }
          );
        }}
        onCancel={() => {
          setRoleAction(null);
          setActionError("");
        }}
      />

      <TwoFAVerifyDialog
        open={showDeactivate}
        title="Deactivate Account"
        description={`This will deactivate ${user.email}'s account. They will lose access immediately.`}
        confirmText="Deactivate"
        destructive
        loading={deactivateUser.isPending}
        error={
          deactivateUser.isError ? deactivateUser.error.message : actionError
        }
        onConfirm={(code) => {
          setActionError("");
          deactivateUser.mutate(
            { userId: id, twoFACode: code },
            {
              onSuccess: () => setShowDeactivate(false),
              onError: (err) => setActionError(err.message),
            }
          );
        }}
        onCancel={() => {
          setShowDeactivate(false);
          setActionError("");
        }}
      />

      <TwoFAVerifyDialog
        open={showRevokeSessions}
        title="Revoke All Sessions"
        description={`This will sign out ${user.email} from all devices immediately.`}
        confirmText="Revoke All"
        destructive
        loading={revokeSessions.isPending}
        error={
          revokeSessions.isError ? revokeSessions.error.message : actionError
        }
        onConfirm={(code) => {
          setActionError("");
          revokeSessions.mutate(
            { userId: id, twoFACode: code },
            {
              onSuccess: () => setShowRevokeSessions(false),
              onError: (err) => setActionError(err.message),
            }
          );
        }}
        onCancel={() => {
          setShowRevokeSessions(false);
          setActionError("");
        }}
      />
    </div>
  );
}
