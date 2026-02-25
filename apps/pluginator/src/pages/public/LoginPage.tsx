import { OAuthButtons } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { verify2FA } from "@/lib/auth";
import { Button, Input } from "@ninsys/ui/components";
import { ParallaxElement } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_2FA_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 30 seconds

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { loginAsync, isLoggingIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeIssuedAt, setChallengeIssuedAt] = useState(0);
  const [useRecovery, setUseRecovery] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);

  const isLocked = lockedUntil > Date.now();

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

  const rawFrom =
    (location.state as { from?: Location })?.from?.pathname || "/dashboard";
  const from =
    rawFrom.startsWith("/") && !rawFrom.startsWith("//")
      ? rawFrom
      : "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const result = await loginAsync({ email, password });
    if (result.requires2FA && result.challengeToken) {
      setChallengeToken(result.challengeToken);
      setChallengeIssuedAt(Date.now());
      setShow2FA(true);
      return;
    }
    if (result.success) {
      navigate(from, { replace: true });
      return;
    }
    setFormError(
      result.error?.message || "Login failed. Please check your credentials."
    );
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setTwoFAError("");

    // Auto-advance
    if (value && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (value && index === 5 && newDigits.every((d) => d)) {
      handle2FASubmit(newDigits.join(""));
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
      handle2FASubmit(text);
    } else {
      digitRefs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const handle2FASubmit = useCallback(
    async (code?: string) => {
      const finalCode =
        code || (useRecovery ? recoveryCode.trim() : digits.join(""));
      if (!finalCode) return;

      // SEC-L1: Check challenge token expiration
      if (
        challengeIssuedAt &&
        Date.now() - challengeIssuedAt > CHALLENGE_TTL_MS
      ) {
        setTwoFAError("Session expired. Please sign in again.");
        return;
      }

      // SEC-L5: Check rate limit
      if (lockedUntil > Date.now()) return;

      setIsVerifying(true);
      setTwoFAError("");

      const result = await verify2FA(challengeToken, finalCode);
      setIsVerifying(false);

      if (result.success) {
        setFailedAttempts(0);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        navigate(from, { replace: true });
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_2FA_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setTwoFAError(
            `Too many failed attempts. Please wait 30 seconds before trying again.`
          );
        } else {
          setTwoFAError(
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
      from,
    ]
  );

  const handleBack = () => {
    setShow2FA(false);
    setChallengeToken("");
    setChallengeIssuedAt(0);
    setDigits(["", "", "", "", "", ""]);
    setRecoveryCode("");
    setTwoFAError("");
    setUseRecovery(false);
    setFailedAttempts(0);
    setLockedUntil(0);
  };

  // 2FA Challenge Screen
  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <BackgroundOrbs />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
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
                    setTwoFAError("");
                  }}
                  placeholder="Enter recovery code"
                  className="text-center font-mono text-lg"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handle2FASubmit();
                  }}
                />
                {twoFAError && (
                  <p className="text-sm text-error text-center">{twoFAError}</p>
                )}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handle2FASubmit()}
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
                    setTwoFAError("");
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
                {twoFAError && (
                  <p className="text-sm text-error text-center">{twoFAError}</p>
                )}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handle2FASubmit()}
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
                    setTwoFAError("");
                  }}
                  className="text-sm text-primary hover:underline w-full text-center cursor-pointer"
                >
                  Use a recovery code instead
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <BackgroundOrbs />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold"
          >
            Welcome back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground mt-2"
          >
            Sign in to access your dashboard
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl"
        >
          <OAuthButtons mode="login" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormError("");
                }}
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError("");
                }}
                required
              />
            </motion.div>

            {formError && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-error"
                role="alert"
              >
                {formError}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function BackgroundOrbs() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <ParallaxElement
        speed={0.1}
        className="absolute"
        style={{ top: "15%", left: "10%" }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="rounded-full blur-3xl"
          style={{
            width: "300px",
            height: "300px",
            background: "oklch(0.627 0.265 303.9 / 0.15)",
          }}
        />
      </ParallaxElement>
      <ParallaxElement
        speed={-0.1}
        className="absolute"
        style={{ bottom: "20%", right: "10%" }}
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="rounded-full blur-3xl"
          style={{
            width: "250px",
            height: "250px",
            background: "oklch(0.70 0.20 290 / 0.12)",
          }}
        />
      </ParallaxElement>
      <ParallaxElement
        speed={0.15}
        className="absolute"
        style={{ top: "60%", left: "60%" }}
      >
        <motion.div
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="rounded-full blur-2xl"
          style={{
            width: "150px",
            height: "150px",
            background: "oklch(0.627 0.265 303.9 / 0.1)",
          }}
        />
      </ParallaxElement>
    </div>
  );
}
