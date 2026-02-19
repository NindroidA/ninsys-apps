// Authentication library for Pluginator
// Connects to NinSys-API for unified auth across nindroidsystems.com

import type { Tier } from "@/types/tier";
import { API_URL, api, fetchJson } from "./api";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  subscriptionTier: Tier;
  createdAt: string;
}

export interface Session {
  user: User;
  expiresAt: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const token = api.getToken();
    if (!token) return null;

    const res = await api.get<Session>("/v2/pluginator/auth/session");
    if (!res.success) {
      api.clearToken();
      return null;
    }
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const data = await fetchJson<{
      success: boolean;
      data?: { token: string };
      error?: AuthError;
    }>("/v2/pluginator/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.data?.token) {
      api.setToken(data.data.token);
    }
    return { success: true };
  } catch (err) {
    // fetchJson throws on non-ok or non-JSON responses
    const message = err instanceof Error ? err.message : "Login failed";
    return {
      success: false,
      error: { code: "AUTH_ERROR", message },
    };
  }
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const data = await fetchJson<{
      success: boolean;
      data?: { token: string };
      error?: AuthError;
    }>("/v2/pluginator/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (data.data?.token) {
      api.setToken(data.data.token);
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return {
      success: false,
      error: { code: "AUTH_ERROR", message },
    };
  }
}

export async function logout(): Promise<void> {
  // Post to server while token is still available for the auth header
  try {
    await api.post("/v2/pluginator/auth/logout");
  } catch {
    // Best-effort server-side logout
  }
  // Clear token so user is logged out regardless of server response
  api.clearToken();
}

/**
 * Validates that a return URL is safe for redirection.
 * Only allows same-origin URLs or relative paths.
 */
function isValidReturnUrl(url: string): boolean {
  try {
    // Handle relative URLs
    if (url.startsWith("/") && !url.startsWith("//")) {
      return true;
    }

    const parsed = new URL(url, window.location.origin);
    // Only allow same origin redirects
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function loginWithGoogle(returnUrl?: string): void {
  const params = new URLSearchParams();
  if (returnUrl && isValidReturnUrl(returnUrl)) {
    params.set("returnUrl", returnUrl);
  }
  window.location.href = `${API_URL}/v2/pluginator/oauth/google?${params.toString()}`;
}

export function loginWithGithub(returnUrl?: string): void {
  const params = new URLSearchParams();
  if (returnUrl && isValidReturnUrl(returnUrl)) {
    params.set("returnUrl", returnUrl);
  }
  window.location.href = `${API_URL}/v2/pluginator/oauth/github?${params.toString()}`;
}
