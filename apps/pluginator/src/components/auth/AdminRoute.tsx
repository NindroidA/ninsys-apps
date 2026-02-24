/**
 * Admin route guard
 * Only allows admin and super_admin roles through.
 * Prompts admins to enable 2FA if not yet configured.
 */

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@ninsys/ui/components";
import { motion } from "framer-motion";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user.totpEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full mx-4"
        >
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7 text-warning" />
            </div>
            <h1 className="text-xl font-bold mb-2">
              Two-Factor Authentication Required
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Admin access requires two-factor authentication to be enabled on
              your account. Set up 2FA in your account settings to continue.
            </p>
            <Button variant="primary" asChild className="w-full">
              <Link to="/account">
                <Lock className="h-4 w-4 mr-2" />
                Go to Account Settings
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
