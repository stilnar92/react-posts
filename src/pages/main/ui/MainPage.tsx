import { useMemo } from 'react';
import { AppHeader } from '../../../widgets/app-header';
import { PostsFeed } from '../../../widgets/posts-feed/ui/PostsFeed';
import { FilterPanel } from '../../../features/posts-filter';
import { PostDetailsModal } from '../../../features/post-details';
import { useFiltersState, useFiltersCacheManager } from '../../../features/posts-filter/model';
import { useDebugMode, useModal } from '../../../shared/hooks';
import type { Post } from '../../../shared/types';

/**
 * MainPage component props
 */
export interface MainPageProps {
  /** Handler for post click (for modal opening in future) */
  onPostClick?: (post: Post) => void;
}

/**
 * MainPage component - the main application page
 * 
 * Features:
 * - Application header with title and subtitle
 * - Filter panel for search and user filtering
 * - Posts feed with responsive grid and filtering
 * - Post details modal for detailed view
 * - Proper container layout and spacing
 * - Post click handling with modal integration
 * - Real-time search and filtering
 * 
 * Layout structure:
 * - Centered container with max-width
 * - Header section at the top
 * - Filter panel below header
 * - Posts feed below with proper spacing
 * - Modal overlay for post details
 * - Responsive padding for mobile/desktop
 * 
 * @param props - MainPage component props
 * @returns JSX element
 */
export function MainPage({ onPostClick }: MainPageProps) {
  // Filters state management
  const {
    state: filtersState,
    setSearchQuery,
    setSelectedUserId,
    hasActiveFilters,
  } = useFiltersState();

  // Filters cache management
  useFiltersCacheManager({
    selectedUserId: filtersState.selectedUserId,
    limit: 10,
  });

  // Post modal management using shared hook
  const { modalProps, actions: modalActions } = useModal();

  // Debug mode
  const { isDebugMode, clearCacheAndReload } = useDebugMode({
    enabled: true,
  });

  // Post click handler - opens modal
  const handlePostClick = (post: Post) => {
    console.log('Post clicked:', post.title);
    
    // Open modal with post data
    modalActions.openModal(post);
    
    // Call external handler if provided
    if (onPostClick) {
      onPostClick(post);
    }
  };

  // Memoized PostsFeed key to prevent unnecessary re-renders
  const postsFeedKey = useMemo(() => {
    return `posts-feed-${filtersState.selectedUserId || 'all'}`;
  }, [filtersState.selectedUserId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* App Header */}
        <AppHeader />
        
        {/* Filter Panel */}
        <div className="mt-8 mb-8">
          <FilterPanel
            searchQuery={filtersState.searchQuery}
            onSearchChange={setSearchQuery}
            selectedUserId={filtersState.selectedUserId}
            onUserFilterChange={setSelectedUserId}
          />
          
          {/* Debug Info - Only in development */}
          {isDebugMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Debug:</strong> searchQuery="{filtersState.searchQuery}", 
                  selectedUserId={filtersState.selectedUserId}, 
                  hasActiveFilters={hasActiveFilters}
                </span>
                <button
                  onClick={clearCacheAndReload}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
                >
                  Clear Cache & Reload
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Posts Feed */}
        <main>
          <PostsFeed 
            key={postsFeedKey}
            onPostClick={handlePostClick}
            searchQuery={filtersState.searchQuery}
            userId={filtersState.selectedUserId}
            showResultsInfo={true}
          />
        </main>
        
      </div>

      {/* Post Details Modal */}
      <PostDetailsModal 
        isOpen={modalProps.isOpen}
        post={modalProps.data}
        onClose={modalProps.onClose}
      />
    </div>
  );
} 