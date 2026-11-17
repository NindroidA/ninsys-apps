export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	/** HTTP status of a failed response (set by the API client for non-2xx JSON replies). */
	status?: number;
	timestamp: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
