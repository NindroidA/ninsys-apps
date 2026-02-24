/**
 * Admin dashboard hooks
 * All endpoints require admin or super_admin role
 */

import { api, fetchJson } from "@/lib/api";
import type { SessionInfo } from "@/hooks/useSessions";
import type { Tier } from "@/types/tier";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  pluginatorTier: string;
  hasPlusDiscount: boolean;
  isActive: boolean;
  totpEnabled: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface SubscriptionRecord {
  id: string;
  tier: Tier;
  status: string;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
}

export interface TierChangeRecord {
  id: string;
  userId: string;
  userEmail?: string;
  previousTier: string;
  newTier: string;
  reason: string;
  frozenData: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetUserId: string | null;
  targetUserEmail: string | null;
  details: string | null;
  createdAt: string;
}

export interface UsageStats {
  updateChecks: number;
  downloads: number;
  syncs: number;
  migrations: number;
}

export interface AdminUserDetail extends AdminUser {
  subscriptions: SubscriptionRecord[];
  sessions: SessionInfo[];
  tierHistory: TierChangeRecord[];
  usage: UsageStats;
}

export interface AdminOverview {
  totalUsers: number;
  activeSubscriptions: number;
  activeSessions: number;
  recentTierChanges: TierChangeRecord[];
  recentAuditLog: AuditLogEntry[];
}

// --- User Management ---

export function useAdminUsers(query?: string, page?: number) {
  return useQuery({
    queryKey: ["admin-users", query, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query || "",
        page: String(page || 1),
        limit: "20",
      });
      const res = await api.get<{
        users: AdminUser[];
        total: number;
        page: number;
        pages: number;
      }>(`/v2/pluginator/admin/users?${params}`);
      if (!res.success || !res.data) {
        return { users: [], total: 0, page: 1, pages: 0 };
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const res = await api.get<AdminUserDetail>(
        `/v2/pluginator/admin/users/${userId}`
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load user");
      }
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useAdminChangeTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      tier,
      reason,
      twoFACode,
    }: {
      userId: string;
      tier: string;
      reason: string;
      twoFACode: string;
    }) => {
      const data = await fetchJson<{ success?: boolean; error?: string }>(
        `/v2/pluginator/admin/users/${userId}/tier`,
        {
          method: "POST",
          body: JSON.stringify({ tier, reason }),
          headers: { "X-2FA-Code": twoFACode },
        }
      );
      if (data.success === false) {
        throw new Error(data.error || "Failed to change tier");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });
}

export function useAdminChangeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
      twoFACode,
    }: {
      userId: string;
      role: string;
      twoFACode: string;
    }) => {
      const data = await fetchJson<{ success?: boolean; error?: string }>(
        `/v2/pluginator/admin/users/${userId}/role`,
        {
          method: "POST",
          body: JSON.stringify({ role }),
          headers: { "X-2FA-Code": twoFACode },
        }
      );
      if (data.success === false) {
        throw new Error(data.error || "Failed to change role");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });
}

export function useAdminDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      twoFACode,
    }: {
      userId: string;
      twoFACode: string;
    }) => {
      const data = await fetchJson<{ success?: boolean; error?: string }>(
        `/v2/pluginator/admin/users/${userId}/deactivate`,
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: { "X-2FA-Code": twoFACode },
        }
      );
      if (data.success === false) {
        throw new Error(data.error || "Failed to deactivate user");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });
}

export function useAdminRevokeSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      twoFACode,
    }: {
      userId: string;
      twoFACode: string;
    }) => {
      const data = await fetchJson<{ success?: boolean; error?: string }>(
        `/v2/pluginator/admin/users/${userId}/revoke-sessions`,
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: { "X-2FA-Code": twoFACode },
        }
      );
      if (data.success === false) {
        throw new Error(data.error || "Failed to revoke sessions");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
    },
  });
}

// --- Overview & Logs ---

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await api.get<AdminOverview>("/v2/pluginator/admin/overview");
      if (!res.success || !res.data) {
        return {
          totalUsers: 0,
          activeSubscriptions: 0,
          activeSessions: 0,
          recentTierChanges: [],
          recentAuditLog: [],
        };
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAdminSessions() {
  return useQuery({
    queryKey: ["admin-sessions"],
    queryFn: async () => {
      const res = await api.get<SessionInfo[]>("/v2/pluginator/admin/sessions");
      if (!res.success || !res.data) return [];
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAdminTierHistory(filters?: {
  userId?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["admin-tier-history", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.userId) params.set("userId", filters.userId);
      if (filters?.page) params.set("page", String(filters.page));
      const res = await api.get<{ entries: TierChangeRecord[]; total: number }>(
        `/v2/pluginator/admin/tier-history?${params}`
      );
      if (!res.success || !res.data) {
        return { entries: [], total: 0 };
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAdminAuditLog(page?: number) {
  return useQuery({
    queryKey: ["admin-audit-log", page],
    queryFn: async () => {
      const res = await api.get<{ entries: AuditLogEntry[]; total: number }>(
        `/v2/pluginator/admin/audit-log?page=${page || 1}`
      );
      if (!res.success || !res.data) {
        return { entries: [], total: 0 };
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}
