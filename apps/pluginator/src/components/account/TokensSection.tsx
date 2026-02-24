/**
 * API Tokens section for Account page
 */

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteToken, useTokens } from "@/hooks/useTokens";
import { Button, Card } from "@ninsys/ui/components";
import { formatDistanceToNow } from "date-fns";
import { Key, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { TokenCreateDialog } from "./TokenCreateDialog";

const MAX_TOKENS = 2;

export function TokensSection() {
  const { data: tokens, isLoading } = useTokens();
  const deleteToken = useDeleteToken();
  const [showCreate, setShowCreate] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const atLimit = (tokens?.length ?? 0) >= MAX_TOKENS;

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">API Tokens</h2>
          </div>
          <Button
            size="sm"
            onClick={() => setShowCreate(true)}
            disabled={atLimit}
          >
            <Plus className="mr-1 h-4 w-4" />
            Generate Token
          </Button>
        </div>

        {atLimit && (
          <p className="text-sm text-muted-foreground mb-4">
            Maximum {MAX_TOKENS} tokens. Delete one to create another.
          </p>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading tokens...</span>
          </div>
        ) : !tokens?.length ? (
          <p className="text-sm text-muted-foreground py-4">
            No access tokens yet. Generate one to use with the CLI or API.
          </p>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm">{token.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <code className="text-xs text-muted-foreground font-mono">
                      {token.prefix}...
                    </code>
                    <span className="text-xs text-muted-foreground">
                      Created{" "}
                      {formatDistanceToNow(new Date(token.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {token.lastUsedAt && (
                      <span className="text-xs text-muted-foreground">
                        Last used{" "}
                        {formatDistanceToNow(new Date(token.lastUsedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0"
                  onClick={() => setRevokeId(token.id)}
                  aria-label={`Revoke token ${token.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <TokenCreateDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke Token"
        description="This token will immediately stop working. Any applications using it will lose access."
        confirmText="Revoke"
        destructive
        loading={deleteToken.isPending}
        onConfirm={() => {
          if (revokeId) {
            deleteToken.mutate(revokeId, {
              onSuccess: () => setRevokeId(null),
            });
          }
        }}
        onCancel={() => setRevokeId(null)}
      />
    </>
  );
}
