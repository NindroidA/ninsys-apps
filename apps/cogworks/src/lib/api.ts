/**
 * API client for Cogworks Dashboard
 *
 * Auth strategy: BFF pattern — httpOnly cookies handle auth automatically.
 * No tokens stored in the frontend. Mutating requests include CSRF token.
 */

import type { ApiResponse } from "@/types/api";

export const API_BASE = "/v2/cogworks";

/**
 * Full URL for browser redirects (OAuth login).
 * fetch() calls use API_BASE (proxied by Vite/nginx), but window.location
 * redirects bypass the proxy, so they need the actual API origin in dev.
 */
export const API_REDIRECT_URL = import.meta.env.DEV ? `http://localhost:3001${API_BASE}` : API_BASE;

// --- CSRF token management (in-memory only) ---

let csrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string | null> {
	try {
		const response = await fetch(`${API_BASE}/auth/csrf-token`, {
			method: "GET",
			credentials: "include",
		});

		if (!response.ok) return null;

		const data = await response.json();
		csrfToken = data.data?.token ?? data.token ?? null;
		return csrfToken;
	} catch {
		return null;
	}
}

let csrfPromise: Promise<string | null> | null = null;

function ensureCsrfToken(): Promise<string | null> {
	if (csrfToken) return Promise.resolve(csrfToken);
	if (csrfPromise) return csrfPromise;
	csrfPromise = fetchCsrfToken().finally(() => {
		csrfPromise = null;
	});
	return csrfPromise;
}

export function clearCsrfToken(): void {
	csrfToken = null;
	csrfPromise = null;
}

// --- Request helpers ---

function buildHeaders(options: {
	includeCsrf: boolean;
	hasBody: boolean;
}): HeadersInit {
	const headers: Record<string, string> = {};

	if (options.hasBody) {
		headers["Content-Type"] = "application/json";
	}

	if (options.includeCsrf && csrfToken) {
		headers["X-CSRF-Token"] = csrfToken;
	}

	return headers;
}

/** Internal sentinel — never leaks to consumers */
const CSRF_RETRY_SENTINEL = "__CSRF_RETRY__";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		// 401 with non-JSON (e.g. HTML redirect from proxy) — treat as auth expired
		if (response.status === 401) {
			clearCsrfToken();
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
			return {
				success: false,
				error: "Session expired",
				timestamp: new Date().toISOString(),
			};
		}
		return {
			success: false,
			error: `Unexpected response (${response.status})`,
			timestamp: new Date().toISOString(),
		};
	}

	const data = await response.json();

	// Normalize error field — API may return string or { code, message } object
	const errorString: string | undefined =
		typeof data.error === "string"
			? data.error
			: typeof data.error === "object" && data.error?.message
				? data.error.message
				: undefined;

	// CSRF token expired — refresh and signal caller to retry
	// API returns error as object { code, message } or string
	const csrfInvalid =
		response.status === 403 &&
		(data.error === "CSRF_TOKEN_INVALID" ||
			(typeof data.error === "object" && data.error?.code === "CSRF_TOKEN_INVALID"));
	if (csrfInvalid) {
		await fetchCsrfToken();
		return {
			success: false,
			error: CSRF_RETRY_SENTINEL,
			timestamp: new Date().toISOString(),
		};
	}

	// 401 Unauthorized — session expired, redirect to login
	if (response.status === 401) {
		clearCsrfToken();
		if (window.location.pathname !== "/login") {
			window.location.href = "/login";
		}
		return {
			success: false,
			error: "Session expired. Please log in again.",
			timestamp: data.timestamp ?? new Date().toISOString(),
		};
	}

	// 429 Rate Limited — include retry-after info
	if (response.status === 429) {
		const retryAfter = response.headers.get("retry-after");
		const message = retryAfter
			? `Rate limited. Try again in ${retryAfter} seconds.`
			: "Rate limited. Please try again later.";
		return {
			success: false,
			error: errorString || message,
			timestamp: data.timestamp ?? new Date().toISOString(),
		};
	}

	if (!response.ok) {
		return {
			success: false,
			error: errorString || `HTTP error ${response.status}`,
			timestamp: data.timestamp ?? new Date().toISOString(),
		};
	}

	return data;
}

// --- Public API methods ---

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		method: "GET",
		headers: buildHeaders({ includeCsrf: false, hasBody: false }),
		credentials: "include",
	});

	return handleResponse<T>(response);
}

async function apiMutate<T>(
	method: "POST" | "PUT" | "DELETE",
	endpoint: string,
	body?: unknown,
): Promise<ApiResponse<T>> {
	await ensureCsrfToken();

	const hasBody = body !== undefined;
	const response = await fetch(`${API_BASE}${endpoint}`, {
		method,
		headers: buildHeaders({ includeCsrf: true, hasBody }),
		credentials: "include",
		body: hasBody ? JSON.stringify(body) : undefined,
	});

	const result = await handleResponse<T>(response);

	// Auto-retry once on CSRF token refresh
	if (!result.success && result.error === CSRF_RETRY_SENTINEL) {
		const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
			method,
			headers: buildHeaders({ includeCsrf: true, hasBody }),
			credentials: "include",
			body: hasBody ? JSON.stringify(body) : undefined,
		});
		const retryResult = await handleResponse<T>(retryResponse);

		// If retry also fails with CSRF, normalize to user-facing error
		if (!retryResult.success && retryResult.error === CSRF_RETRY_SENTINEL) {
			return {
				success: false,
				error: "Authentication error. Please refresh the page.",
				timestamp: new Date().toISOString(),
			};
		}
		return retryResult;
	}

	return result;
}

export function apiPost<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
	return apiMutate<T>("POST", endpoint, body);
}

export function apiPut<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
	return apiMutate<T>("PUT", endpoint, body);
}

export function apiDelete<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
	return apiMutate<T>("DELETE", endpoint, body);
}

/**
 * Throws if the API response was unsuccessful. Returns the data if successful.
 * Use inside mutationFn to convert API errors into thrown Errors for React Query.
 */
export function throwOnApiError<T>(result: ApiResponse<T>, fallbackMessage: string): T {
	if (!result.success) {
		const msg = typeof result.error === "string" ? result.error : fallbackMessage;
		throw new Error(msg);
	}
	if (result.data === undefined) {
		throw new Error(fallbackMessage);
	}
	return result.data;
}

/**
 * Extracts an array from an API response that may be wrapped in an object.
 * Handles both `{ data: [...] }` and `{ data: { items: [...] } }` shapes.
 * Returns [] if the response failed or data is missing.
 */
export function unwrapArray<T>(result: ApiResponse<unknown>): T[] {
	if (!result.success || !result.data) return [];
	const d = result.data;
	if (Array.isArray(d)) return d as T[];
	if (typeof d === "object" && d !== null) {
		const values = Object.values(d as Record<string, unknown>);
		const arr = values.find((v) => Array.isArray(v));
		if (arr) return arr as T[];
	}
	return [];
}
