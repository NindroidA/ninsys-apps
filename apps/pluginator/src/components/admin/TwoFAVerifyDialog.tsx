/**
 * 2FA re-verification dialog for sensitive admin actions
 */

import { Button, Input } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

interface TwoFAVerifyDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  destructive?: boolean;
  loading?: boolean;
  error?: string;
  onConfirm: (code: string) => void;
  onCancel: () => void;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TwoFAVerifyDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  destructive = false,
  loading = false,
  error,
  onConfirm,
  onCancel,
}: TwoFAVerifyDialogProps) {
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);
  const prevErrorRef = useRef(error);

  const isLocked = lockedUntil > Date.now();

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCode("");
      setAttempts(0);
      setLockedUntil(0);
      setLockCountdown(0);
    }
  }, [open]);

  // Track failed attempts by watching error prop changes
  useEffect(() => {
    if (error && error !== prevErrorRef.current && !loading) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
      }
    }
    prevErrorRef.current = error;
  }, [error, loading, attempts]);

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockCountdown(0);
        setLockedUntil(0);
      } else {
        setLockCountdown(remaining);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleContentKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && !loading) {
      onCancel();
      return;
    }
    if (e.key === "Tab") {
      const focusable =
        e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const titleId = "twofaverify-dialog-title";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={loading ? undefined : onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleContentKeyDown}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 id={titleId} className="text-lg font-semibold">
                {title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            <div className="mb-4">
              <label
                htmlFor="twofa-verify-code"
                className="text-sm font-medium block mb-2"
              >
                Enter your 2FA code to confirm
              </label>
              <Input
                id="twofa-verify-code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-[0.3em] font-mono"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && code.length === 6 && !isLocked)
                    onConfirm(code);
                }}
                disabled={isLocked}
              />
            </div>

            {isLocked && (
              <p className="text-sm text-red-500 mb-4" role="alert">
                Too many failed attempts. Please wait {lockCountdown}s before
                trying again.
              </p>
            )}

            {error && !isLocked && (
              <p className="text-sm text-red-500 mb-4" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={() => onConfirm(code)}
                disabled={code.length !== 6 || loading || isLocked}
                className={
                  destructive
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                    : ""
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLocked ? `Wait ${lockCountdown}s` : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
