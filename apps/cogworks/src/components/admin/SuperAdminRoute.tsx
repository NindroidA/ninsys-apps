import { useAuth } from "@/hooks/useAuth";
import { useSessionRefresh } from "@/hooks/useSessionRefresh";
import { apiPost } from "@/lib/api";
import { Button, Card, Input } from "@ninsys/ui/components";
import { Loader2, Lock } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/** Session expires after 15 minutes */
const SESSION_TTL_MS = 15 * 60 * 1000;
/** Lock form after 5 consecutive failures */
const MAX_FAILURES = 5;
/** Lockout duration: 30 seconds */
const LOCKOUT_MS = 30_000;

const SESSION_KEY = "cogworks_admin_session";

function getStoredSession(): { userId: string; expiresAt: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() < parsed.expiresAt) return parsed;
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  } catch {
    return null;
  }
}

function setStoredSession(userId: string, expiresAt: number) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId, expiresAt }));
}

function isSessionValid(userId: string | undefined): boolean {
  if (!userId) return false;
  const session = getStoredSession();
  return session !== null && session.userId === userId;
}

export function useSuperAdminVerified() {
  const session = getStoredSession();
  return session !== null;
}

export function resetSuperAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

interface SuperAdminRouteProps {
  children: ReactNode;
}

export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { isOwner, isLoading, user, isAuthenticated } = useAuth();
  useSessionRefresh(isAuthenticated);
  const [verified, setVerified] = useState(() => isSessionValid(user?.id));
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [failures, setFailures] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // Re-check session validity when user changes
  useEffect(() => {
    setVerified(isSessionValid(user?.id));
  }, [user?.id]);

  // Auto-expire session after TTL
  useEffect(() => {
    if (!verified) return;
    const session = getStoredSession();
    if (!session) {
      setVerified(false);
      return;
    }
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      resetSuperAdminSession();
      setVerified(false);
      return;
    }
    const timer = setTimeout(() => {
      resetSuperAdminSession();
      setVerified(false);
    }, remaining);
    return () => clearTimeout(timer);
  }, [verified]);

  // Clear lockout after duration
  useEffect(() => {
    if (!lockedUntil) return;
    const remaining = lockedUntil - Date.now();
    if (remaining <= 0) {
      setLockedUntil(null);
      return;
    }
    const timer = setTimeout(() => setLockedUntil(null), remaining);
    return () => clearTimeout(timer);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleVerify = useCallback(async () => {
    if (code.length !== 6 || isLocked) return;
    setVerifying(true);
    setError(null);
    try {
      const result = await apiPost<{ verified: boolean }>(
        "/admin/totp/verify",
        {
          code,
        }
      );
      if (result.success && result.data?.verified && user?.id) {
        setStoredSession(user.id, Date.now() + SESSION_TTL_MS);
        setVerified(true);
        setFailures(0);
      } else {
        const newFailures = failures + 1;
        setFailures(newFailures);
        if (newFailures >= MAX_FAILURES) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setError(`Too many attempts. Locked for 30 seconds.`);
        } else {
          setError(
            `Invalid code. ${MAX_FAILURES - newFailures} attempts remaining.`
          );
        }
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
      setCode("");
    }
  }, [code, isLocked, user?.id, failures]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Super Admin Access</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your TOTP code to continue
            </p>
          </div>

          <div className="space-y-3">
            <Input
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(v);
              }}
              placeholder="000000"
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={6}
              autoFocus
              disabled={verifying || isLocked}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={code.length !== 6 || verifying || isLocked}
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : isLocked ? (
                "Locked"
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
