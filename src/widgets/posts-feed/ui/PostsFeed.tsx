import { usePostsWithFiltersAndSearch } from '../../../entities/post/model/usePostsWithFiltersAndSearch';
import { PostCard, PostCardSkeleton } from '../../../entities/post/ui';
import { ErrorState, EmptyState, LoadMoreTrigger } from '../../../shared/ui';
import type { Post } from '../../../shared/types';

/**
 * PostsFeed component props
 */
export interface PostsFeedProps {
  /** Handler for post click (for modal opening) */
  onPostClick?: (post: Post) => void;
  /** Additional CSS classes */
  className?: string | undefined;
  /** Number of posts per page (default: 10) */
  limit?: number;
  /** Search query for client-side filtering */
  searchQuery?: string;
  /** User ID for server-side filtering */
  userId?: number | undefined;
  /** Whether to show search/filter results info */
  showResultsInfo?: boolean;
}

/**
 * PostsFeed widget for displaying an infinite scroll list of posts with search and filtering
 * 
 * Features:
 * - Infinite scroll with automatic loading
 * - Server-side filtering by user ID
 * - Client-side search by title/content
 * - Vertical list layout with proper spacing
 * - Persistent caching with localStorage
 * - Loading states with specialized skeleton from entities
 * - Error handling with shared ErrorState
 * - Empty state with shared EmptyState
 * - Post click handling for modal opening
 * - Performance optimized with pagination
 * - Results information display
 * 
 * Architecture:
 * - Uses usePostsWithFiltersAndSearch hook for data management
 * - LoadMoreTrigger for infinite scroll UX
 * - Specialized skeleton from post entity
 * - Clean separation of concerns with FSD
 * 
 * @param props - PostsFeed component props
 * @returns JSX element
 */
export function PostsFeed({ 
  onPostClick, 
  className, 
  limit = 10,
  searchQuery = '',
  userId,
  showResultsInfo = false,
}: PostsFeedProps) {
  const { 
    posts, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMore, 
    refetch,
    search,
    filters,
  } = usePostsWithFiltersAndSearch({
    limit,
    serverFilters: userId !== undefined ? { userId } : {},
    searchQuery,
    enabled: true,
  });

  // Loading state with specialized skeletons from entities
  if (loading && posts.length === 0) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {Array.from({ length: limit }, (_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state using shared ErrorState component
  if (error && posts.length === 0) {
    return (
      <ErrorState
        message="Failed to load posts"
        description={error}
        onRetry={refetch}
        retryText="Try Again"
        className={className}
      />
    );
  }

  // Empty state using shared EmptyState component
  if (!posts || posts.length === 0) {
    // Different messages based on whether filters are active
    const isFiltered = filters.hasActiveFilters || search.hasActiveSearch;
    
    return (
      <EmptyState
        title={isFiltered ? "No posts found" : "No posts available"}
        description={
          isFiltered 
            ? "No posts match your current search or filter criteria. Try adjusting your filters."
            : "There are no posts to display at the moment."
        }
        className={className}
      />
    );
  }

  // Success state with posts in infinite scroll list
  return (
    <div className={`${className || ''}`} key={`posts-feed-${userId || 'all'}`}>
      {/* Results Info */}
      {showResultsInfo && (search.hasActiveSearch || filters.hasActiveFilters) && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-700">
              {search.hasActiveSearch && (
                <span>
                  Found <strong>{search.matchCount}</strong> posts matching your search
                  {search.totalCount !== search.matchCount && (
                    <span className="text-gray-500"> (of {search.totalCount} total)</span>
                  )}
                </span>
              )}
              {search.hasActiveSearch && filters.hasActiveFilters && (
                <span className="mx-2">•</span>
              )}
              {filters.hasActiveFilters && !search.hasActiveSearch && (
                <span>
                  Showing posts from selected user
                </span>
              )}
            </div>
            
            {(search.hasActiveSearch || filters.hasActiveFilters) && (
              <span className="text-gray-500">
                {posts.length} result{posts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <PostCard
            key={post.id}
            post={post}
            {...(onPostClick && { onClick: onPostClick })}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <LoadMoreTrigger
        variant="auto"
        loading={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        loadingText="Loading more posts..."
        autoTrigger={true}
      />
    </div>
  );
} 