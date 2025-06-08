import { useClientSearch } from '../../../shared/hooks';
import { useInfinitePosts } from './useInfinitePosts';
import { ServerFiltersConfig } from './useServerFilters';
import type { Post, PaginatedPostsResponse } from '../../../shared/types';

/**
 * Configuration for usePostsWithFiltersAndSearch hook
 */
interface UsePostsWithFiltersAndSearchConfig {
  /** Items per page (default: 10) */
  limit?: number;
  /** Server-side filters configuration */
  serverFilters?: ServerFiltersConfig;
  /** Client-side search query */
  searchQuery?: string;
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
}

/**
 * Return interface for usePostsWithFiltersAndSearch hook
 */
interface UsePostsWithFiltersAndSearchReturn {
  /** Final filtered and searched posts */
  posts: Post[];
  /** Raw server data (before client search) */
  serverData: Post[];
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
  /** Search metadata */
  search: {
    /** Number of matches found by client search */
    matchCount: number;
    /** Whether client search is active */
    hasActiveSearch: boolean;
    /** Original data count before client search */
    totalCount: number;
  };
  /** Filter metadata */
  filters: {
    /** Whether any server filters are active */
    hasActiveFilters: boolean;
  };
}

/**
 * Composite hook that combines server-side filtering with client-side search
 * 
 * Data Flow:
 * 1. Server filters (userId) → API request with filters
 * 2. Server data → Client search by title/body 
 * 3. Final filtered data → UI
 * 
 * Features:
 * - Server-side filtering for performance
 * - Client-side search for immediate feedback
 * - Infinite scroll support
 * - Proper cache invalidation
 * - Clear separation of concerns
 * - Extensible architecture
 * 
 * @param config - Configuration object
 * @returns Object with filtered data and control functions
 */
export function usePostsWithFiltersAndSearch({
  limit = 10,
  serverFilters = {},
  searchQuery = '',
  enabled = true,
}: UsePostsWithFiltersAndSearchConfig = {}): UsePostsWithFiltersAndSearchReturn {
  
  if (import.meta.env.DEV) {
    console.log('usePostsWithFiltersAndSearch: hook called', { 
      limit, 
      serverFilters, 
      searchQuery, 
      enabled 
    });
  }
  
  // Step 1: Get data from server with server-side filtering
  const infiniteConfig = {
    limit,
    enabled,
    ...(serverFilters.userId !== undefined && { userId: serverFilters.userId }),
  };
  
  const {
    posts: serverData,
    pages,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    invalidateCache,
  } = useInfinitePosts(infiniteConfig);
  
  // Step 2: Apply client-side search to server data
  const {
    filteredData: finalPosts,
    matchCount,
    hasActiveSearch,
    totalCount,
  } = useClientSearch({
    data: serverData,
    searchQuery,
    searchFields: (post: Post) => [post.title, post.body],
  });
  
  // Calculate metadata
  const hasActiveFilters = Object.values(serverFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  if (import.meta.env.DEV) {
    console.log('usePostsWithFiltersAndSearch: current state', { 
      serverDataCount: serverData.length,
      finalPostsCount: finalPosts.length,
      matchCount,
      hasActiveSearch,
      hasActiveFilters,
      loading,
      error 
    });
  }

  return {
    posts: finalPosts,
    serverData,
    pages,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    invalidateCache,
    search: {
      matchCount,
      hasActiveSearch,
      totalCount,
    },
    filters: {
      hasActiveFilters,
    },
  };
} 