import { useState, useEffect, useRef, useCallback } from 'react';
import { UniversalCacheManager } from './useInfiniteApi';

/**
 * Configuration for useApi hook
 */
export interface UseApiConfig {
  /** Cache key for the request */
  cacheKey: string;
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTtl?: number;
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
  /** Whether to use persistent cache (localStorage) (default: true) */
  persistentCache?: boolean;
  /** Whether to refetch on window focus (default: false) */
  refetchOnFocus?: boolean;
}

/**
 * Return interface for useApi hook
 */
export interface UseApiReturn<T> {
  /** Loaded data */
  data: T | null;
  /** Loading state for initial fetch */
  loading: boolean;
  /** Error message if request failed */
  error: string | null;
  /** Function to manually refetch data */
  refetch: () => void;
  /** Function to invalidate cache for this key */
  invalidateCache: () => void;
}

/**
 * Global in-memory cache for single API responses
 */
const memoryCache = new Map<string, any>();

/**
 * Shared utilities for API caching and request management
 */
export const ApiUtils = {
  /**
   * Get data from cache synchronously
   */
  getCachedData<T>(cacheKey: string, persistentCache: boolean): T | null {
    try {
      const entry = persistentCache 
        ? UniversalCacheManager.get<T>(cacheKey)
        : memoryCache.get(cacheKey);
        
      if (entry && !UniversalCacheManager.isInfiniteEntry(entry)) {
        return entry.data;
      }
      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`ApiUtils.getCachedData [${cacheKey}]: Failed to get cache data`, error);
      }
      return null;
    }
  },

  /**
   * Set data in cache
   */
  setCachedData<T>(cacheKey: string, data: T, cacheTtl: number, persistentCache: boolean): void {
    const entry = UniversalCacheManager.createSingleEntry(data, cacheTtl);
    
    if (persistentCache) {
      UniversalCacheManager.set(cacheKey, entry);
    } else {
      memoryCache.set(cacheKey, entry);
    }
  },

  /**
   * Check if cache is stale
   */
  isCacheStale<T>(cacheKey: string, persistentCache: boolean, staleThreshold = 30 * 1000): boolean {
    const entry = persistentCache 
      ? UniversalCacheManager.get<T>(cacheKey)
      : memoryCache.get(cacheKey);
      
    if (!entry || UniversalCacheManager.isInfiniteEntry(entry)) return true;
    
    const now = Date.now();
    return (now - entry.timestamp) > staleThreshold;
  },

  /**
   * Delete from cache
   */
  deleteFromCache(cacheKey: string, persistentCache: boolean): void {
    if (persistentCache) {
      UniversalCacheManager.delete(cacheKey);
    } else {
      memoryCache.delete(cacheKey);
    }
  },

  /**
   * Create AbortController for request cancellation
   */
  createRequestController(existingController: React.MutableRefObject<AbortController | null>): AbortController {
    // Cancel any ongoing request
    if (existingController.current) {
      existingController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    existingController.current = controller;
    return controller;
  },

  /**
   * Handle request cleanup
   */
  cleanupRequest(controller: AbortController, controllerRef: React.MutableRefObject<AbortController | null>): void {
    // Clear the ref if this was the current controller
    if (controllerRef.current === controller) {
      controllerRef.current = null;
    }
  }
};

/**
 * Generic API hook with caching capabilities
 * 
 * Features:
 * - Persistent localStorage cache with memory fallback
 * - Stale-while-revalidate pattern
 * - Manual refetch capability
 * - Cache invalidation
 * - Prevents duplicate requests
 * - React Strict Mode compatible
 * - Uses UniversalCacheManager for unified caching
 * 
 * @param fetcher - Async function that returns the data
 * @param config - Configuration object
 * @returns Object with data, loading, error states and control functions
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  config: UseApiConfig
): UseApiReturn<T> {
  const { 
    cacheKey, 
    cacheTtl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    persistentCache = true,
    refetchOnFocus = false
  } = config;

  /**
   * Get initial data from cache synchronously
   */
  const getInitialData = useCallback((): T | null => {
    if (!enabled) return null;
    return ApiUtils.getCachedData<T>(cacheKey, persistentCache);
  }, [enabled, persistentCache, cacheKey]);

  // Initialize data with cached data immediately (synchronously)
  const [data, setData] = useState<T | null>(() => getInitialData());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debug logging for state changes
  if (import.meta.env.DEV) {
    const dataInfo = data ? (Array.isArray(data) ? `array(${data.length})` : 'object') : 'null';
    console.log(`useApi [${cacheKey}]: Current state - data:`, dataInfo, 'loading:', loading, 'error:', error);
  }

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(async (showLoading = true): Promise<void> => {
    const controller = ApiUtils.createRequestController(abortControllerRef);

    if (import.meta.env.DEV) {
      console.log(`useApi [${cacheKey}]: Starting fetch, showLoading=${showLoading}`);
    }

    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }
      
      const result = await fetcher();
      
      // Check if request was aborted
      if (controller.signal.aborted) {
        if (import.meta.env.DEV) {
          console.log(`useApi [${cacheKey}]: Request was aborted, skipping state update`);
        }
        return;
      }
      
      setData(result);
      setError(null);
      ApiUtils.setCachedData(cacheKey, result, cacheTtl, persistentCache);
      
    } catch (err) {
      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }

      if (import.meta.env.DEV) {
        console.error(`useApi [${cacheKey}]: Fetch failed:`, err);
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      // Check if request was aborted
      if (!controller.signal.aborted) {
        if (showLoading) {
          setLoading(false);
        }
      }
      
      ApiUtils.cleanupRequest(controller, abortControllerRef);
    }
  }, [fetcher, cacheKey, cacheTtl, persistentCache]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  /**
   * Invalidate cache for this key
   */
  const invalidateCache = useCallback(() => {
    ApiUtils.deleteFromCache(cacheKey, persistentCache);
    refetch();
  }, [cacheKey, persistentCache, refetch]);

  /**
   * Handle window focus refetch
   */
  const handleFocus = useCallback(() => {
    if (refetchOnFocus && ApiUtils.isCacheStale<T>(cacheKey, persistentCache)) {
      fetchData(false); // Background refetch without loading state
    }
  }, [refetchOnFocus, cacheKey, persistentCache, fetchData]);

  // Effect for initial data loading
  useEffect(() => {
    if (!enabled) return;

    // If we already have data from cache, check if it's stale
    if (data) {
      if (ApiUtils.isCacheStale<T>(cacheKey, persistentCache)) {
        if (import.meta.env.DEV) {
          console.log(`useApi [${cacheKey}]: Cache is stale, background refetch`);
        }
        fetchData(false);
      }
    } else {
      // No data available, fetch with loading
      if (import.meta.env.DEV) {
        console.log(`useApi [${cacheKey}]: No data available, fetching with loading`);
      }
      fetchData(true);
    }

    // Cleanup function - abort any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [enabled, cacheKey, data, persistentCache, fetchData]);

  // Effect for window focus refetch
  useEffect(() => {
    if (!refetchOnFocus) return;

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnFocus, handleFocus]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache,
  };
} 