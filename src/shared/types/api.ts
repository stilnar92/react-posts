import { Post } from './post';

/**
 * Generic API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * API error interface for structured error handling
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code if available */
  status?: number;
  /** Original error for debugging */
  originalError?: Error;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Start index (0-based, alternative to page) */
  start?: number;
}

/**
 * Extended pagination parameters with server-side filtering support
 */
export interface PaginationWithFiltersParams extends PaginationParams {
  /** Filter by user ID (server-side filter) */
  userId?: number;
}

/**
 * Pagination metadata from API response
 */
export interface PaginationMeta {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages available */
  hasMore: boolean;
  /** Next page number, undefined if no more pages */
  nextPage?: number | undefined;
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  data: T[];
  /** Pagination metadata */
  pagination: PaginationMeta;
}

/**
 * Posts API response type
 */
export type PostsApiResponse = ApiResponse<Post[]>;

/**
 * Paginated posts API response type
 */
export type PaginatedPostsResponse = PaginatedResponse<Post>;

/**
 * Fetch options for API calls
 */
export interface FetchOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Pagination parameters */
  pagination?: PaginationParams;
} 