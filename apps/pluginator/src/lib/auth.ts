// Authentication library for Pluginator
// Connects to NinSys-API for unified auth across nindroidsystems.com

import type { Tier } from "@/types/tier";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nindroidsystems.com";

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
		const token = localStorage.getItem("pluginator_token");
		if (!token) return null;

		const res = await fetch(`${API_URL}/v2/pluginator/auth/session`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!res.ok) {
			localStorage.removeItem("pluginator_token");
			return null;
		}
		const data = await res.json();
		return data.data;
	} catch {
		return null;
	}
}

export async function login(
	email: string,
	password: string,
): Promise<{ success: boolean; error?: AuthError }> {
	try {
		const res = await fetch(`${API_URL}/v2/pluginator/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (!res.ok) {
			return { success: false, error: data.error };
		}
		// Store token in localStorage
		if (data.data?.token) {
			localStorage.setItem("pluginator_token", data.data.token);
		}
		return { success: true };
	} catch {
		return { success: false, error: { code: "NETWORK_ERROR", message: "Network error" } };
	}
}

export async function register(
	email: string,
	password: string,
	name?: string,
): Promise<{ success: boolean; error?: AuthError }> {
	try {
		const res = await fetch(`${API_URL}/v2/pluginator/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
		});
		const data = await res.json();
		if (!res.ok) {
			return { success: false, error: data.error };
		}
		// Store token in localStorage
		if (data.data?.token) {
			localStorage.setItem("pluginator_token", data.data.token);
		}
		return { success: true };
	} catch {
		return { success: false, error: { code: "NETWORK_ERROR", message: "Network error" } };
	}
}

export async function logout(): Promise<void> {
	const token = localStorage.getItem("pluginator_token");
	if (token) {
		await fetch(`${API_URL}/v2/pluginator/auth/logout`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	localStorage.removeItem("pluginator_token");
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
