// Common API types used across modules

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
