/**
 * Device session management hooks
 */

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface SessionInfo {
  id: string;
  deviceName: string;
  authMethod: "jwt" | "pat";
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export function useSessions() {
  return useQuery<SessionInfo[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get<SessionInfo[]>(
        "/v2/pluginator/account/sessions"
      );
      if (!res.success || !res.data) return [];
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.delete(
        `/v2/pluginator/account/sessions/${sessionId}`
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to revoke session");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
