/**
 * Two-Factor Authentication section for Account page
 */

import { useAuth } from "@/hooks/useAuth";
import { useDisable2FA } from "@/hooks/useTwoFactor";
import { Button, Card, Input } from "@ninsys/ui/components";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { TwoFactorSetupDialog } from "./TwoFactorSetupDialog";

export function TwoFactorSection() {
  const { user } = useAuth();
  const disable2FA = useDisable2FA();
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [disableCode, setDisableCode] = useState("");

  const isEnabled = user?.totpEnabled ?? false;

  async function handleDisable() {
    if (disableCode.length < 6) return;
    try {
      await disable2FA.mutateAsync({ code: disableCode });
      setShowDisable(false);
      setDisableCode("");
    } catch {
      // Error handled by mutation state
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        </div>

        {isEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">
                Two-factor authentication is enabled
              </span>
            </div>

            {showDisable ? (
              <div className="space-y-3 max-w-sm">
                <p className="text-sm text-muted-foreground">
                  Enter your current TOTP code to disable 2FA.
                </p>
                <Input
                  value={disableCode}
                  onChange={(e) =>
                    setDisableCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-[0.3em] font-mono"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && disableCode.length === 6)
                      handleDisable();
                    if (e.key === "Escape") {
                      setShowDisable(false);
                      setDisableCode("");
                    }
                  }}
                />
                {disable2FA.isError && (
                  <p className="text-sm text-red-500">
                    {disable2FA.error.message}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                    onClick={handleDisable}
                    disabled={disableCode.length !== 6 || disable2FA.isPending}
                  >
                    {disable2FA.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Disable 2FA
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowDisable(false);
                      setDisableCode("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                onClick={() => setShowDisable(true)}
              >
                Disable 2FA
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account. You'll need an
              authenticator app like Google Authenticator or Authy.
            </p>
            <Button onClick={() => setShowSetup(true)}>
              <Lock className="mr-2 h-4 w-4" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}
      </Card>

      <TwoFactorSetupDialog
        open={showSetup}
        onClose={() => setShowSetup(false)}
      />
    </>
  );
}
