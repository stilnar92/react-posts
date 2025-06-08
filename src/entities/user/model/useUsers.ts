import { useCallback, useRef, useEffect } from 'react';
import { fetchUsers, JsonPlaceholderUser } from '../../../shared/api/users';
import { useApi } from '../../../shared/hooks';
import { FetchOptions, User } from '../../../shared/types';

/**
 * Transform JSONPlaceholder user to our app's User interface
 */
function transformUser(apiUser: JsonPlaceholderUser): User {
  // Generate initials from name
  const initials = apiUser.name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return {
    id: apiUser.id,
    name: apiUser.name,
    initials,
  };
}

/**
 * Configuration for useUsers hook
 */
export interface UseUsersConfig {
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTtl?: number;
  /** Whether to use persistent cache (default: true) */
  persistentCache?: boolean;
  /** Additional fetch options */
  fetchOptions?: FetchOptions;
}

/**
 * Hook for fetching and managing users data using project's useApi system
 * 
 * Features:
 * - Uses project's native useApi hook
 * - Persistent caching with localStorage  
 * - Stale-while-revalidate pattern
 * - Error handling and loading states
 * - TypeScript support
 * - Transforms API data to app format
 * 
 * @param config - Configuration object
 * @returns Object with users data, loading state, error, and utility functions
 */
export function useUsers(config: UseUsersConfig = {}) {
  const {
    enabled = true,
    cacheTtl = 5 * 60 * 1000, // 5 minutes
    persistentCache = true,
    fetchOptions = {},
  } = config;

  // Use ref to store current fetchOptions to avoid recreating fetcher
  const fetchOptionsRef = useRef(fetchOptions);
  
  // Update ref when fetchOptions changes
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  // Create users fetcher function - now stable without dependencies
  const usersFetcher = useCallback(async (): Promise<User[]> => {
    if (import.meta.env.DEV) {
      console.log('useUsers: fetching users from API');
    }
    
    const apiUsers = await fetchUsers(fetchOptionsRef.current);
    
    // Transform API users to app User format
    const transformedUsers = apiUsers.map(transformUser);
    
    if (import.meta.env.DEV) {
      console.log('useUsers: transformed', apiUsers.length, 'users');
    }
    
    return transformedUsers;
  }, []); // ← Stable function without dependencies

  // Use project's native useApi hook
  const {
    data: users,
    loading: isLoading,
    error,
    refetch,
    invalidateCache,
  } = useApi(usersFetcher, {
    cacheKey: 'users',
    cacheTtl,
    enabled,
    persistentCache,
    refetchOnFocus: false,
  });

  if (import.meta.env.DEV) {
    console.log('useUsers: current state', { 
      usersCount: users?.length || 0, 
      isLoading, 
      error 
    });
  }

  return {
    // Data
    users: users || [],
    
    // Loading states  
    isLoading,
    isError: !!error,
    error,
    
    // Status flags
    isSuccess: !isLoading && !error && users !== null,
    isFetching: isLoading, // Alias for compatibility
    
    // Utility functions
    refetch,
    invalidateCache,
    
    // Computed values
    isEmpty: !isLoading && (!users || users.length === 0),
    hasUsers: !isLoading && users && users.length > 0,
    totalCount: users?.length || 0,
  };
} 