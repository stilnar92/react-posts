// Re-export all API functions and configuration
export { fetchPosts, fetchPaginatedPosts } from './posts';
export { fetchUsers } from './users';
export { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  DEFAULT_TIMEOUT, 
  DEFAULT_HEADERS 
} from './config'; 

// Type exports for API consistency
export type {
  ApiResponse,
  ApiError,
  PostsApiResponse,
  FetchOptions,
} from '../types';
export type { JsonPlaceholderUser } from './users'; 