import { useEffect } from 'react';
import { UniversalCacheManager } from '../../../shared/hooks';

/**
 * Configuration for filters cache management
 */
export interface FiltersCacheConfig {
  /** Selected user ID */
  selectedUserId: number | undefined;
  /** Posts per page limit */
  limit?: number;
}

/**
 * Hook for managing cache when filters change
 * 
 * Cache logic:
 * - When selecting specific user: clear "all users" cache
 * - When selecting "all users": clear all specific user caches
 * - Prevents conflicts between different filters
 * 
 * @param config - cache manager configuration
 */
export function useFiltersCacheManager({
  selectedUserId,
  limit = 10,
}: FiltersCacheConfig) {
  
  useEffect(() => {
    if (selectedUserId !== undefined) {
      // Specific user selected - clear "all users" cache
      const allUsersKey = `posts_infinite_limit_${limit}_user_all`;
      UniversalCacheManager.delete(allUsersKey);
      
      if (import.meta.env.DEV) {
        console.log('useFiltersCacheManager: Cleared "all users" cache for user', selectedUserId);
      }
    } else {
      // "All users" selected - clear specific user caches
      // JSONPlaceholder has 10 users, so clear cache for each
      for (let userId = 1; userId <= 10; userId++) {
        const userCacheKey = `posts_infinite_limit_${limit}_user_${userId}`;
        UniversalCacheManager.delete(userCacheKey);
      }
      
      if (import.meta.env.DEV) {
        console.log('useFiltersCacheManager: Cleared all user-specific caches');
      }
    }
  }, [selectedUserId, limit]);

  // Function to clear all cache (useful for debug)
  const clearAllCache = () => {
    if (import.meta.env.DEV) {
      // Clear all possible cache keys for posts
      UniversalCacheManager.delete(`posts_infinite_limit_${limit}_user_all`);
      
      for (let userId = 1; userId <= 10; userId++) {
        UniversalCacheManager.delete(`posts_infinite_limit_${limit}_user_${userId}`);
      }
      
      console.log('useFiltersCacheManager: Cleared all posts cache');
    }
  };

  return {
    clearAllCache,
  };
} 