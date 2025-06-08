// Re-export all shared types for clean imports
export type { Post } from './post';
export type { User, UserAvatarColor } from './user';
export type { 
  ApiResponse, 
  ApiError, 
  PostsApiResponse, 
  PaginatedPostsResponse,
  PaginationParams,
  PaginationWithFiltersParams,
  PaginationMeta,
  PaginatedResponse,
  FetchOptions 
} from './api'; 