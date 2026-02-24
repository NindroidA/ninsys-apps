/**
 * Admin Sessions page - all active sessions across all users
 */

import { useAdminSessions } from "@/hooks/useAdmin";
import { FadeIn } from "@ninsys/ui/components/animations";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Monitor } from "lucide-react";

export function AdminSessionsPage() {
  const { data: sessions, isLoading } = useAdminSessions();

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Monitor className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          {sessions && (
            <span className="text-sm text-muted-foreground">
              ({sessions.length} total)
            </span>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading sessions...</span>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Device
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Auth Method
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Last Active
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!sessions?.length ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No active sessions.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{session.deviceName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {session.authMethod === "pat" ? "Token" : "Browser"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(session.lastActiveAt), {
                            addSuffix: true,
                          })}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(session.createdAt), {
                            addSuffix: true,
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
