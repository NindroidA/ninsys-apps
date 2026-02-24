/**
 * Admin Users List page
 */

import { ROLE_COLORS, TIER_BADGE_CLASSES } from "@/lib/constants";
import { useAdminUsers } from "@/hooks/useAdmin";
import { TIER_DISPLAY } from "@/types/tier";
import { Button, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, isLoading } = useAdminUsers(debouncedSearch, page);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Users</h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by email, username, or ID..."
            className="pl-10"
            aria-label="Search users"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading users...</span>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Username
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Tier
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Last Login
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data?.users?.length ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          {debouncedSearch
                            ? "No users match your search."
                            : "No users found."}
                        </td>
                      </tr>
                    ) : (
                      data.users.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navigate(`/admin/users/${user.id}`);
                            }
                          }}
                          tabIndex={0}
                          role="link"
                          className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <td className="px-4 py-3 font-medium">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {user.username}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                ROLE_COLORS[user.role] ?? ROLE_COLORS.user
                              )}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                TIER_BADGE_CLASSES[user.pluginatorTier] ??
                                  TIER_BADGE_CLASSES.free
                              )}
                            >
                              {TIER_DISPLAY[
                                user.pluginatorTier as keyof typeof TIER_DISPLAY
                              ]?.name ?? user.pluginatorTier}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.isActive ? (
                              <span className="text-xs text-success">
                                Active
                              </span>
                            ) : (
                              <span className="text-xs text-red-500">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {user.lastLogin
                              ? format(new Date(user.lastLogin), "MMM d, yyyy")
                              : "Never"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {data.total} users total
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
                    Page {page} of {data.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page >= data.pages}
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
