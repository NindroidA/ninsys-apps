/**
 * Active Sessions section for Account page
 */

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useRevokeSession, useSessions } from "@/hooks/useSessions";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge, Card } from "@ninsys/ui/components";
import { Button } from "@ninsys/ui/components";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Monitor, Trash2 } from "lucide-react";
import { useState } from "react";

const TIER_SESSION_LIMITS: Record<string, number> = {
  free: 1,
  plus: 2,
  pro: 3,
  max: 5,
};

export function SessionsSection() {
  const { data: sessions, isLoading } = useSessions();
  const revokeSession = useRevokeSession();
  const { user } = useAuth();
  const { data: subscription } = useSubscription();
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const tier = subscription?.tier ?? user?.subscriptionTier ?? "free";
  const maxSessions = TIER_SESSION_LIMITS[tier] ?? 1;

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Active Sessions</h2>
          </div>
          {sessions && (
            <span className="text-sm text-muted-foreground">
              {sessions.length} of {maxSessions} device slots
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading sessions...</span>
          </div>
        ) : !sessions?.length ? (
          <p className="text-sm text-muted-foreground py-4">
            No active sessions found.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{session.deviceName}</p>
                    {session.isCurrent && (
                      <Badge variant="default" className="text-xs">
                        this device
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {session.authMethod === "pat" ? "Token" : "Browser"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Active{" "}
                      {formatDistanceToNow(new Date(session.lastActiveAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0"
                    onClick={() => setRevokeId(session.id)}
                    aria-label={`Revoke session on ${session.deviceName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke Session"
        description="This device will be signed out immediately."
        confirmText="Revoke"
        destructive
        loading={revokeSession.isPending}
        onConfirm={() => {
          if (revokeId) {
            revokeSession.mutate(revokeId, {
              onSuccess: () => setRevokeId(null),
            });
          }
        }}
        onCancel={() => setRevokeId(null)}
      />
    </>
  );
}
