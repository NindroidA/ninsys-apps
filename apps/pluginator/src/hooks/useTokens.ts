/**
 * Personal Access Token management hooks
 */

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface TokenInfo {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CreateTokenResponse {
  token: string;
  name: string;
  prefix: string;
}

export function useTokens() {
  return useQuery<TokenInfo[]>({
    queryKey: ["tokens"],
    queryFn: async () => {
      const res = await api.get<TokenInfo[]>("/v2/pluginator/account/tokens");
      if (!res.success || !res.data) return [];
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useCreateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.post<CreateTokenResponse>(
        "/v2/pluginator/account/tokens",
        data
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to create token");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}

export function useDeleteToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokenId: string) => {
      const res = await api.delete(`/v2/pluginator/account/tokens/${tokenId}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to revoke token");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}
