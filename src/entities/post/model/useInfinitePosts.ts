import { useCallback, useRef, useEffect, useMemo } from 'react';
import { fetchPaginatedPosts } from '../../../shared/api';
import { useInfiniteApi } from '../../../shared/hooks';
import type { Post, PaginationParams, PaginatedPostsResponse } from '../../../shared/types';

/**
 * Configuration for useInfinitePosts hook
 */
interface UseInfinitePostsConfig {
  /** Items per page (default: 10) */
  limit?: number;
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
  /** Filter by user ID (server-side filter) */
  userId?: number;
}

/**
 * Return interface for useInfinitePosts hook
 */
interface UseInfinitePostsReturn {
  /** Flattened array of all loaded posts */
  posts: Post[];
  /** Array of all loaded pages */
  pages: PaginatedPostsResponse[];
  /** Loading state for initial fetch */
  loading: boolean;
  /** Loading state for fetching next page */
  loadingMore: boolean;
  /** Error message if request failed */
  error: string | null;
  /** Whether there are more pages to load */
  hasMore: boolean;
  /** Function to load next page */
  loadMore: () => void;
  /** Function to manually refetch all data */
  refetch: () => void;
  /** Function to invalidate cache */
  invalidateCache: () => void;
}

/**
 * Hook for infinite scroll posts functionality with server-side filtering
 * 
 * Features:
 * - Infinite scroll pagination for posts
 * - Server-side filtering by userId
 * - Persistent caching with localStorage
 * - Stale-while-revalidate pattern
 * - Error handling and loading states
 * - TypeScript support
 * - Performance optimized
 * 
 * @param config - Configuration object
 * @returns Object with posts data and control functions
 */
export function useInfinitePosts({
  limit = 10,
  enabled = true,
  userId,
}: UseInfinitePostsConfig = {}): UseInfinitePostsReturn {
  
  if (import.meta.env.DEV) {
    console.log('useInfinitePosts: hook called', { limit, enabled, userId });
  }
  
  // Use ref to store current userId to avoid recreating fetcher
  const userIdRef = useRef(userId);
  
  // Update ref when userId changes
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  
  // Posts fetcher function for useInfiniteApi with server filtering
  const postsFetcher = useCallback(
    async (params: PaginationParams): Promise<PaginatedPostsResponse> => {
      const currentUserId = userIdRef.current;
      
      if (import.meta.env.DEV) {
        console.log('useInfinitePosts: fetching posts', { ...params, userId: currentUserId });
      }
      
      // Pass userId to API for server-side filtering
      const requestParams = currentUserId !== undefined 
        ? { ...params, userId: currentUserId }
        : params;
        
      return await fetchPaginatedPosts(requestParams);
    },
    [] // ← Теперь стабильная функция без dependencies
  );

  // Create cache key that includes userId for proper caching - memoized to prevent recreation
  const cacheKey = useMemo(() => 
    `posts_infinite_limit_${limit}_user_${userId || 'all'}`, 
    [limit, userId]
  );

  // Memoize configuration to prevent useInfiniteApi re-initialization
  const config = useMemo(() => ({
    cacheKey,
    limit,
    enabled,
    cacheTtl: 5 * 60 * 1000, // 5 minutes cache
    persistentCache: true,
  }), [cacheKey, limit, enabled]);

  // Use infinite API hook with posts-specific configuration
  const {
    data: posts,
    pages,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    invalidateCache,
  } = useInfiniteApi(postsFetcher, config);

  if (import.meta.env.DEV) {
    console.log('useInfinitePosts: current state', { 
      postsCount: posts.length, 
      pagesCount: pages.length, 
      loading, 
      loadingMore, 
      hasMore, 
      error,
      userId 
    });
  }

  return {
    posts,
    pages,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    invalidateCache,
  };
} 