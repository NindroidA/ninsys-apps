import {
  type AuthError,
  type Session,
  type User,
  getSession,
  login,
  logout,
  register,
} from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DEV_BYPASS =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_AUTH_BYPASS === "true";

function getDevSession(): Session {
  return {
    user: {
      id: "dev-user",
      email: "dev@pluginator.local",
      name: "Dev User",
      avatarUrl: null,
      emailVerified: true,
      subscriptionTier: "free",
      createdAt: new Date().toISOString(),
    },
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  };
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: getSession,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // In dev mode with explicit opt-in, fall back to mock session when not authenticated
  const effectiveSession = session ?? (DEV_BYPASS ? getDevSession() : null);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => register(email, password, name),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.clear();
    },
  });

  return {
    user: effectiveSession?.user ?? null,
    isAuthenticated: !!effectiveSession?.user,
    isLoading: DEV_BYPASS ? false : isLoading,
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    loginError: loginMutation.data?.error as AuthError | undefined,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    registerError: registerMutation.data?.error as AuthError | undefined,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
