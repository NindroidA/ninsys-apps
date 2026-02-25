/**
 * OAuth 2FA Challenge Page
 *
 * Handles the 2FA verification step for OAuth logins.
 * The API redirects here with a challengeToken when a user
 * with 2FA enabled authenticates via Google/GitHub OAuth.
 */

import { verify2FA } from "@/lib/auth";
import { Button, Input } from "@ninsys/ui/components";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_2FA_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 30 seconds

export function AuthTwoFactorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const challengeToken = searchParams.get("challengeToken");
  const [challengeIssuedAt] = useState(Date.now());

  const [useRecovery, setUseRecovery] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);

  const isLocked = lockedUntil > Date.now();

  // Clear sensitive token from URL immediately
  useEffect(() => {
    if (challengeToken) {
      window.history.replaceState({}, "", "/auth/2fa");
    }
  }, [challengeToken]);

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

  // If no challenge token, redirect to login
  if (!challengeToken) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Session Expired</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in again to continue.
          </p>
          <Button variant="primary" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError("");

    if (value && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newDigits.every((d) => d)) {
      handleSubmit(newDigits.join(""));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const newDigits = [...digits];
    for (let i = 0; i < text.length; i++) {
      newDigits[i] = text[i]!;
    }
    setDigits(newDigits);
    if (text.length === 6) {
      handleSubmit(text);
    } else {
      digitRefs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const handleSubmit = useCallback(
    async (code?: string) => {
      const finalCode =
        code || (useRecovery ? recoveryCode.trim() : digits.join(""));
      if (!finalCode || !challengeToken) return;

      if (Date.now() - challengeIssuedAt > CHALLENGE_TTL_MS) {
        setError("Session expired. Please sign in again.");
        return;
      }

      if (lockedUntil > Date.now()) return;

      setIsVerifying(true);
      setError("");

      const result = await verify2FA(challengeToken, finalCode);
      setIsVerifying(false);

      if (result.success) {
        setFailedAttempts(0);
        queryClient.removeQueries({ queryKey: ["auth"] });
        navigate("/dashboard", { replace: true });
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_2FA_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setError(
            "Too many failed attempts. Please wait 30 seconds before trying again."
          );
        } else {
          setError(
            result.error?.message || "Invalid code. Please try again."
          );
        }

        if (!useRecovery) {
          setDigits(["", "", "", "", "", ""]);
          digitRefs.current[0]?.focus();
        }
      }
    },
    [
      useRecovery,
      recoveryCode,
      digits,
      challengeToken,
      challengeIssuedAt,
      lockedUntil,
      failedAttempts,
      queryClient,
      navigate,
    ]
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div aria-live="assertive" className="sr-only">
          Two-factor authentication required. Enter your code to continue.
        </div>
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <motion.img
                src="/favicon.svg"
                alt="Pluginator"
                className="h-10 w-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span className="font-bold text-xl">Pluginator</span>
            </Link>
          </motion.div>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
          <p className="text-muted-foreground mt-2">
            {useRecovery
              ? "Enter one of your recovery codes"
              : "Enter the 6-digit code from your authenticator app"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl"
        >
          {useRecovery ? (
            <div className="space-y-4">
              <Input
                value={recoveryCode}
                onChange={(e) => {
                  setRecoveryCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter recovery code"
                className="text-center font-mono text-lg"
                maxLength={20}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
              {error && (
                <p className="text-sm text-error text-center" role="alert">
                  {error}
                </p>
              )}
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleSubmit()}
                disabled={!recoveryCode.trim() || isVerifying || isLocked}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : isLocked ? (
                  `Wait ${lockCountdown}s`
                ) : (
                  "Verify"
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setUseRecovery(false);
                  setRecoveryCode("");
                  setError("");
                }}
                className="text-sm text-primary hover:underline w-full text-center cursor-pointer"
              >
                Use authenticator code instead
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <fieldset>
                <legend className="sr-only">
                  Enter 6-digit verification code
                </legend>
                <div
                  className="flex justify-center gap-2"
                  onPaste={handleDigitPaste}
                >
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        digitRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      autoFocus={i === 0}
                      aria-label={`Digit ${i + 1} of 6`}
                      className="w-12 h-14 text-center text-2xl font-mono rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    />
                  ))}
                </div>
              </fieldset>
              {error && (
                <p className="text-sm text-error text-center" role="alert">
                  {error}
                </p>
              )}
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleSubmit()}
                disabled={digits.some((d) => !d) || isVerifying || isLocked}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : isLocked ? (
                  `Wait ${lockCountdown}s`
                ) : (
                  "Verify"
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setUseRecovery(true);
                  setDigits(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="text-sm text-primary hover:underline w-full text-center cursor-pointer"
              >
                Use a recovery code instead
              </button>
            </div>
          )}

          <Link
            to="/login"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto justify-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
