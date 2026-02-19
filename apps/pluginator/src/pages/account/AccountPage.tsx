/**
 * Account Page
 * Profile management, security, and account settings
 */

import { SubscriptionBadge } from "@/components/pluginator/SubscriptionBadge";
import { UsageDashboard } from "@/components/pluginator/UsageDashboard";
import {
  useChangePassword,
  useConnections,
  useDeleteAccount,
  useUpdateProfile,
} from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { loginWithGithub, loginWithGoogle } from "@/lib/auth";
import { Button, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
  Check,
  Eye,
  EyeOff,
  Key,
  Link2,
  Loader2,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import React, { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountPage() {
  const { user, logout } = useAuth();
  const { data: subscription } = useSubscription();
  const navigate = useNavigate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            {subscription && <SubscriptionBadge tier={subscription.tier} />}
          </div>
        </FadeIn>

        <div className="space-y-8">
          {/* Profile Section */}
          <FadeIn delay={0.1}>
            <ProfileSection user={user} memberSince={memberSince} />
          </FadeIn>

          {/* Password Section */}
          <FadeIn delay={0.15}>
            <PasswordSection />
          </FadeIn>

          {/* Connected Accounts Section */}
          <FadeIn delay={0.2}>
            <ConnectionsSection />
          </FadeIn>

          {/* Usage Dashboard */}
          <FadeIn delay={0.25}>
            <h2 className="text-2xl font-bold mb-4">Usage</h2>
            <UsageDashboard />
          </FadeIn>

          {/* Danger Zone */}
          <FadeIn delay={0.3}>
            <DangerZoneSection
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              onDeleteSuccess={() => {
                logout();
                navigate("/");
              }}
            />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Section ─── */

interface ProfileSectionProps {
  user: { email: string; name: string | null } | null;
  memberSince: string | null;
}

function ProfileSection({ user, memberSince }: ProfileSectionProps) {
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await updateProfile.mutateAsync({ name: trimmed });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // Error handled by mutation state
    }
  }

  function handleCancel() {
    setName(user?.name ?? "");
    setEditing(false);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Profile</h2>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-sm text-muted-foreground">Email</span>
          <p className="font-medium">{user?.email || "Not logged in"}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Display Name</span>
          {editing ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="max-w-xs"
                maxLength={50}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!name.trim() || updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-medium">{user?.name || "Not set"}</p>
              <button
                type="button"
                onClick={() => {
                  setName(user?.name ?? "");
                  setEditing(true);
                }}
                className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
                aria-label="Edit name"
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {success && (
                <span className="flex items-center gap-1 text-xs text-success">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          )}
          {updateProfile.isError && (
            <p className="text-sm text-red-500 mt-1">
              {updateProfile.error.message}
            </p>
          )}
        </div>
        {memberSince && (
          <div>
            <span className="text-sm text-muted-foreground">Member since</span>
            <p className="font-medium">{memberSince}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ─── Password Section ─── */

function PasswordSection() {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords don't match.");
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setSuccess(true);
          setTimeout(() => setSuccess(false), 5000);
        },
      }
    );
  }

  const error =
    validationError ||
    (changePassword.isError ? changePassword.error.message : "");

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Key className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Password</h2>
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-success/10 text-success text-sm mb-4 flex items-center gap-2">
          <Check className="h-4 w-4" />
          Password changed successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label
            htmlFor="current-password"
            className="text-sm text-muted-foreground block mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="text-sm text-muted-foreground block mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="text-sm text-muted-foreground block mb-1"
          >
            Confirm New Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={
            changePassword.isPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
        >
          {changePassword.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Change Password
        </Button>
      </form>
    </Card>
  );
}

/* ─── Connected Accounts Section ─── */

function ConnectionsSection() {
  const { data: connections, isLoading } = useConnections();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Google */}
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div>
                <p className="font-medium text-sm">Google</p>
                {connections?.google ? (
                  <p className="text-xs text-success">Connected</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Not connected</p>
                )}
              </div>
            </div>
            {!connections?.google && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  loginWithGoogle(`${window.location.origin}/account`)
                }
              >
                Connect
              </Button>
            )}
            {connections?.google && <Check className="h-4 w-4 text-success" />}
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium text-sm">GitHub</p>
                {connections?.github ? (
                  <p className="text-xs text-success">Connected</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Not connected</p>
                )}
              </div>
            </div>
            {!connections?.github && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  loginWithGithub(`${window.location.origin}/account`)
                }
              >
                Connect
              </Button>
            )}
            {connections?.github && <Check className="h-4 w-4 text-success" />}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ─── Danger Zone Section ─── */

interface DangerZoneSectionProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

function DangerZoneSection({
  showDeleteDialog,
  setShowDeleteDialog,
  onDeleteSuccess,
}: DangerZoneSectionProps) {
  const deleteAccount = useDeleteAccount();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Lock body scroll when dialog is open
  React.useEffect(() => {
    if (!showDeleteDialog) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteDialog]);

  async function handleDelete() {
    try {
      await deleteAccount.mutateAsync();
      onDeleteSuccess();
    } catch {
      // Error shown in dialog
    }
  }

  return (
    <>
      <Card className="p-6 border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone. If you have an active subscription, it will be
          cancelled immediately.
        </p>
        <Button
          variant="outline"
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30 hover:border-red-500/50"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </Card>

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !deleteAccount.isPending) {
              setShowDeleteDialog(false);
              setDeleteConfirmText("");
            }
          }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={
              deleteAccount.isPending
                ? undefined
                : () => {
                    setShowDeleteDialog(false);
                    setDeleteConfirmText("");
                  }
            }
            onKeyDown={undefined}
          />
          <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 id="delete-dialog-title" className="text-lg font-semibold mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account, cancel any active
              subscriptions, and remove all your data. This action cannot be
              reversed.
            </p>
            <div className="mb-4">
              <label
                htmlFor="delete-confirm"
                className="text-sm font-medium block mb-2"
              >
                Type <span className="font-mono text-red-500">DELETE</span> to
                confirm
              </label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                autoFocus
              />
            </div>
            {deleteAccount.isError && (
              <p className="text-sm text-red-500 mb-4">
                {deleteAccount.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmText("");
                }}
                disabled={deleteAccount.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                onClick={handleDelete}
                disabled={
                  deleteConfirmText !== "DELETE" || deleteAccount.isPending
                }
              >
                {deleteAccount.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
