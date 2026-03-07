/**
 * API client for Pluginator
 * Wraps fetch with auth headers and error handling
 *
 * Auth strategy:
 * - Session auth uses httpOnly cookies (set by the API, sent automatically via credentials: "include")
 * - Mutating requests include a CSRF token to prevent cross-origin attacks
 * - No tokens are stored in localStorage/sessionStorage
 */

export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://api.nindroidsystems.com";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Legacy token cleanup ---
// Remove any tokens left in storage from previous versions
localStorage.removeItem("pluginator_token");
sessionStorage.removeItem("pluginator_token");

// --- CSRF token management ---
let csrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/v2/pluginator/auth/csrf-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    csrfToken = data.token ?? null;
    return csrfToken;
  } catch {
    return null;
  }
}

export async function ensureCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  return fetchCsrfToken();
}

export function clearCsrfToken(): void {
  csrfToken = null;
}

// --- Request helpers ---

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  // Guard against non-JSON responses (e.g. HTML 404 pages)
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      success: false,
      error: `Unexpected response (${response.status})`,
    };
  }

  const data = await response.json();

  // CSRF token expired — refresh and let caller retry
  if (response.status === 403 && data.error === "CSRF_TOKEN_INVALID") {
    await fetchCsrfToken();
    return {
      success: false,
      error: "CSRF token refreshed, please retry",
    };
  }

  if (!response.ok) {
    return {
      success: false,
      error: data.error || `HTTP error ${response.status}`,
    };
  }

  return data;
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  await ensureCsrfToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * Lower-level JSON fetch that returns the raw API body typed as T.
 * Throws on non-JSON responses and non-ok status codes.
 * Use this when the response shape doesn't match ApiResponse<T>
 * (e.g. flat responses like { success, themes, pagination }).
 */
export async function fetchJson<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Ensure CSRF token for mutating requests
  const method = options?.method?.toUpperCase() ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    await ensureCsrfToken();
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (csrfToken && method !== "GET" && method !== "HEAD") {
    (headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Unexpected response (${response.status})`);
  }

  const data = await response.json();

  // CSRF token expired — refresh and retry once
  if (response.status === 403 && data.error === "CSRF_TOKEN_INVALID") {
    await fetchCsrfToken();
    throw new Error("CSRF token refreshed, please retry");
  }

  if (!response.ok) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : data.error?.message ?? `HTTP error ${response.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  await ensureCsrfToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: buildHeaders(),
    credentials: "include",
  });

  return handleResponse<T>(response);
}

export const api = {
  get: apiGet,
  post: apiPost,
  delete: apiDelete,
  fetchJson,
  ensureCsrfToken,
  clearCsrfToken,
};
