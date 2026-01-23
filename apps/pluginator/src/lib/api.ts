/**
 * API client for Pluginator
 * Wraps fetch with auth headers and error handling
 */

const API_URL = import.meta.env.VITE_API_URL || "https://api.nindroidsystems.com";

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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
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
	const token = getAuthToken();
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		method: "GET",
		headers,
		credentials: "include",
	});

	return handleResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
	const token = getAuthToken();
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		method: "POST",
		headers,
		credentials: "include",
		body: body ? JSON.stringify(body) : undefined,
	});

	return handleResponse<T>(response);
}

export const api = {
	get: apiGet,
	post: apiPost,
	setToken: setAuthToken,
	clearToken: clearAuthToken,
	getToken: getAuthToken,
};
