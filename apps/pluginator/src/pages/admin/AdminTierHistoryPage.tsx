/**
 * Admin Tier History page
 */

import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { useAdminTierHistory } from "@/hooks/useAdmin";
import { TIER_DISPLAY } from "@/types/tier";
import { Button, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Loader2,
  Search,
} from "lucide-react";
import { useRef, useState } from "react";

export function AdminTierHistoryPage() {
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedUserId, setDebouncedUserId] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, isLoading } = useAdminTierHistory({
    userId: debouncedUserId || undefined,
    page,
  });

  const handleSearch = (value: string) => {
    setUserId(value);
    setPage(1);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedUserId(value);
    }, 300);
  };

  const totalPages = data ? Math.ceil(data.total / ADMIN_PAGE_SIZE) : 0;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Tier Change History</h1>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={userId}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Filter by user ID or email..."
            className="pl-10"
            aria-label="Filter tier history"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading tier history...</span>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        User
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Change
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Reason
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data?.entries?.length ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          No tier changes found.
                        </td>
                      </tr>
                    ) : (
                      data.entries.map((change) => (
                        <tr key={change.id} className="border-t border-border">
                          <td className="px-4 py-3 font-medium">
                            {change.userEmail || change.userId}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">
                              {TIER_DISPLAY[
                                change.previousTier as keyof typeof TIER_DISPLAY
                              ]?.name ?? change.previousTier}
                            </span>
                            {" → "}
                            <span className="font-medium">
                              {TIER_DISPLAY[
                                change.newTier as keyof typeof TIER_DISPLAY
                              ]?.name ?? change.newTier}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                            {change.reason}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {format(
                              new Date(change.createdAt),
                              "MMM d, yyyy HH:mm"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {data!.total} changes total
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </FadeIn>
    </div>
  );
}
