/**
 * API client for Pluginator
 * Wraps fetch with auth headers and error handling
 */

export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://api.nindroidsystems.com";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getAuthToken(): string | null {
  return localStorage.getItem("pluginator_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("pluginator_token", token);
}

export function clearAuthToken(): void {
  localStorage.removeItem("pluginator_token");
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
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
    headers: buildHeaders(),
    credentials: "include",
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
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
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...options?.headers,
    },
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Unexpected response (${response.status})`);
  }

  const data = await response.json();

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
  setToken: setAuthToken,
  clearToken: clearAuthToken,
  getToken: getAuthToken,
};
