/**
 * Account management hooks
 * Profile updates, password changes, OAuth connections, account deletion
 */

import { api, clearAuthToken } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface OAuthConnections {
  google: boolean;
  github: boolean;
}

export function useConnections() {
  return useQuery<OAuthConnections>({
    queryKey: ["account", "connections"],
    queryFn: async () => {
      const res = await api.get<OAuthConnections>(
        "/v2/pluginator/account/connections"
      );
      if (!res.success || !res.data) {
        return { google: false, github: false };
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      avatarUrl?: string;
      bio?: string;
    }) => {
      const res = await api.post("/v2/pluginator/account/profile", data);
      if (!res.success) {
        throw new Error(res.error || "Failed to update profile");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await api.post("/v2/pluginator/account/password", data);
      if (!res.success) {
        throw new Error(res.error || "Failed to change password");
      }
      return res.data;
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/v2/pluginator/account/delete");
      if (!res.success) {
        throw new Error(res.error || "Failed to delete account");
      }
      clearAuthToken();
      return res.data;
    },
  });
}
