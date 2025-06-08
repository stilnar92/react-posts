/**
 * API configuration for JSONPlaceholder integration
 */

/** Base URL for JSONPlaceholder API */
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/** API endpoints */
export const API_ENDPOINTS = {
  posts: '/posts',
  users: '/users',
  comments: '/comments',
} as const;

/** Default timeout for API requests (in milliseconds) */
export const DEFAULT_TIMEOUT = 10000;

/** Default headers for API requests */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const; 