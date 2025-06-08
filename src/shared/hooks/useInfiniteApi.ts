import { useState, useEffect, useRef, useCallback } from 'react';
import type { PaginatedResponse, PaginationParams } from '../types';
import { ApiUtils } from './useApi';

/**
 * Generic cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Cache entry interface for infinite scroll data
 */
interface InfiniteCacheEntry<T> {
  pages: PaginatedResponse<T>[];
  timestamp: number;
  expiresAt: number;
}

/**
 * Global in-memory cache for all API responses
 */
const memoryCache = new Map<string, CacheEntry<any> | InfiniteCacheEntry<any>>();

/**
 * Universal cache manager for both single and infinite scroll data
 */
export class UniversalCacheManager {
  private static readonly CACHE_PREFIX = 'api_cache_';
  
  /**
   * Get data from cache (works for both single and infinite data)
   */
  static get<T>(key: string): CacheEntry<T> | InfiniteCacheEntry<T> | null {
    try {
      // Try localStorage first
      const stored = localStorage.getItem(this.CACHE_PREFIX + key);
      if (stored) {
        const entry = JSON.parse(stored) as CacheEntry<T> | InfiniteCacheEntry<T>;
        
        // Check if expired
        if (Date.now() > entry.expiresAt) {
          this.delete(key);
          return null;
        }
        
        // Update memory cache for faster access
        memoryCache.set(key, entry);
        return entry;
      }
    } catch (error) {
      console.warn('localStorage unavailable for cache');
    }
    
    // Fallback to memory cache
    return memoryCache.get(key) || null;
  }
  
  /**
   * Set data in cache (works for both single and infinite data)
   */
  static set<T>(key: string, entry: CacheEntry<T> | InfiniteCacheEntry<T>): void {
    try {
      // Store in localStorage
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('localStorage write failed for cache');
    }
    
    // Always store in memory cache
    memoryCache.set(key, entry);
  }
  
  /**
   * Delete from cache
   */
  static delete(key: string): void {
    try {
      localStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      // Ignore localStorage errors
    }
    
    memoryCache.delete(key);
  }
  
  /**
   * Clear all cache entries
   */
  static clear(): void {
    try {
      // Clear localStorage entries
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Ignore localStorage errors
    }
    
    memoryCache.clear();
  }
  
  /**
   * Check if data is infinite scroll type
   */
  static isInfiniteEntry<T>(entry: CacheEntry<T> | InfiniteCacheEntry<T>): entry is InfiniteCacheEntry<T> {
    return 'pages' in entry;
  }
  
  /**
   * Create single data cache entry
   */
  static createSingleEntry<T>(data: T, cacheTtl: number): CacheEntry<T> {
    const now = Date.now();
    return {
      data,
      timestamp: now,
      expiresAt: now + cacheTtl,
    };
  }
  
  /**
   * Create infinite scroll cache entry
   */
  static createInfiniteEntry<T>(pages: PaginatedResponse<T>[], cacheTtl: number): InfiniteCacheEntry<T> {
    const now = Date.now();
    return {
      pages,
      timestamp: now,
      expiresAt: now + cacheTtl,
    };
  }
}

/**
 * Configuration for useInfiniteApi hook
 */
interface UseInfiniteApiConfig extends PaginationParams {
  /** Cache key for the request */
  cacheKey: string;
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTtl?: number;
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
  /** Whether to use persistent cache (localStorage) (default: true) */
  persistentCache?: boolean;
}

/**
 * Return interface for useInfiniteApi hook
 */
interface UseInfiniteApiReturn<T> {
  /** Flattened array of all loaded items */
  data: T[];
  /** Array of all loaded pages */
  pages: PaginatedResponse<T>[];
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
  /** Function to invalidate cache for this key */
  invalidateCache: () => void;
}

/**
 * Infinite scroll API hook with caching capabilities
 * 
 * Features:
 * - Infinite scroll pagination
 * - Persistent localStorage cache with memory fallback
 * - Stale-while-revalidate pattern
 * - Manual refetch capability
 * - Cache invalidation
 * - Prevents duplicate requests
 * - React Strict Mode compatible
 * 
 * @param fetcher - Async function that returns paginated data
 * @param config - Configuration object
 * @returns Object with data, loading, error states and control functions
 */
export function useInfiniteApi<T>(
  fetcher: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  config: UseInfiniteApiConfig
): UseInfiniteApiReturn<T> {
  const { 
    cacheKey, 
    limit = 10,
    cacheTtl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    persistentCache = true
  } = config;

  /**
   * Get initial data from cache synchronously
   */
  const getInitialData = useCallback((): PaginatedResponse<T>[] => {
    if (!enabled) return [];
    
    try {
      const entry = persistentCache 
        ? UniversalCacheManager.get<T>(cacheKey)
        : memoryCache.get(cacheKey);
        
      if (entry && UniversalCacheManager.isInfiniteEntry(entry)) {
        return entry.pages;
      }
      return [];
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`useInfiniteApi [${cacheKey}]: Failed to get initial cache data`, error);
      }
      return [];
    }
  }, [enabled, persistentCache, cacheKey]);

  // Initialize pages with cached data immediately - no delay!
  const [pages, setPages] = useState<PaginatedResponse<T>[]>(() => getInitialData());
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize hasMore based on cached data
  const [hasMore, setHasMore] = useState<boolean>(() => {
    const initialPages = getInitialData();
    if (initialPages.length > 0) {
      const lastPage = initialPages[initialPages.length - 1];
      return lastPage.pagination.hasMore;
    }
    return true;
  });
  
  // Use AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Track current page for loading more - initialize with cached data
  const initialPageNumber = (() => {
    const initialPages = getInitialData();
    if (initialPages.length > 0) {
      const lastPage = initialPages[initialPages.length - 1];
      return lastPage.pagination.page;
    }
    return 1;
  })();
  const currentPageRef = useRef<number>(initialPageNumber);
  
  // Track retry attempts to prevent infinite loops
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Debug logging
  if (import.meta.env.DEV) {
    const totalItems = pages.reduce((acc, page) => acc + page.data.length, 0);
    console.log(`useInfiniteApi [${cacheKey}]: pages: ${pages.length}, items: ${totalItems}, hasMore: ${hasMore}`);
  }

  /**
   * Store pages in cache
   */
  const setCachedPages = useCallback((newPages: PaginatedResponse<T>[]): void => {
    const entry = UniversalCacheManager.createInfiniteEntry(newPages, cacheTtl);
    
    if (persistentCache) {
      UniversalCacheManager.set(cacheKey, entry);
    } else {
      memoryCache.set(cacheKey, entry);
    }
  }, [cacheKey, cacheTtl, persistentCache]);

  /**
   * Fetch a specific page
   */
  const fetchPage = useCallback(async (page: number, showLoading = true, isRefetch = false): Promise<void> => {
    const controller = ApiUtils.createRequestController(abortControllerRef);

    try {
      if (showLoading) {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);
      }
      
      const result = await fetcher({ page, limit });
      
      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }
      
      // Reset retry count on successful request
      retryCountRef.current = 0;
      
      setPages(prevPages => {
        let newPages: PaginatedResponse<T>[];
        
        if (page === 1 && (isRefetch || prevPages.length === 0)) {
          // Replace all pages for refetch or initial load
          newPages = [result];
        } else {
          // Add new page to existing pages (load more)
          newPages = [...prevPages, result];
        }
        
        // Update cache
        setCachedPages(newPages);
        return newPages;
      });
      
      setHasMore(result.pagination.hasMore);
      setError(null);
      currentPageRef.current = result.pagination.page;
      
    } catch (err) {
      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Increment retry count
      retryCountRef.current += 1;
      
      if (import.meta.env.DEV) {
        console.warn(`useInfiniteApi [${cacheKey}]: Request failed (attempt ${retryCountRef.current}/${maxRetries}):`, errorMessage);
      }
      
      // Set error state - this will stop further automatic retries
      setError(errorMessage);
      
      // For server errors, we should not retry automatically to prevent infinite loops
      // User can manually retry using refetch or refresh
      
    } finally {
      // Check if request was aborted
      if (!controller.signal.aborted) {
        if (showLoading) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
      
      ApiUtils.cleanupRequest(controller, abortControllerRef);
    }
  }, [fetcher, limit, setCachedPages, cacheKey, maxRetries]);

  /**
   * Load more data (next page)
   */
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    
    const nextPage = currentPageRef.current + 1;
    fetchPage(nextPage, true, false);
  }, [hasMore, loadingMore, loading, fetchPage]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(() => {
    // Reset retry counter for manual refetch
    retryCountRef.current = 0;
    currentPageRef.current = 1;
    setPages([]);
    setHasMore(true);
    setError(null);
    fetchPage(1, true, true);
  }, [fetchPage]);

  /**
   * Invalidate cache for this key
   */
  const invalidateCache = useCallback(() => {
    // Use UniversalCacheManager directly for infinite scroll cache
    if (persistentCache) {
      UniversalCacheManager.delete(cacheKey);
    } else {
      memoryCache.delete(cacheKey);
    }
    refetch();
  }, [cacheKey, refetch, persistentCache]);

  // Effect for initial data loading
  useEffect(() => {
    if (!enabled) return;

    // If we have cached data, initialization is handled in the initial effect above
    if (pages.length > 0) {
      if (import.meta.env.DEV) {
        console.log(`useInfiniteApi [${cacheKey}]: Using cached data, skipping initial fetch`);
      }
      return;
    }

    // Check if we've already tried and failed too many times
    if (retryCountRef.current >= maxRetries) {
      if (import.meta.env.DEV) {
        console.log(`useInfiniteApi [${cacheKey}]: Max retries reached (${maxRetries}), not fetching`);
      }
      return;
    }

    // No data available, fetch first page with loading
    if (import.meta.env.DEV) {
      console.log(`useInfiniteApi [${cacheKey}]: No cached data, fetching first page`);
    }
    
    // Create a stable fetch function to avoid dependency issues
    const fetchFirstPage = async () => {
      const controller = ApiUtils.createRequestController(abortControllerRef);

      try {
        setLoading(true);
        setError(null);
        
        const result = await fetcher({ page: 1, limit });
        
        if (controller.signal.aborted) {
          return;
        }
        
        // Reset retry count on successful request
        retryCountRef.current = 0;
        
        setPages([result]);
        setHasMore(result.pagination.hasMore);
        setError(null);
        currentPageRef.current = result.pagination.page;
        
        // Update cache
        const entry = UniversalCacheManager.createInfiniteEntry([result], cacheTtl);
        if (persistentCache) {
          UniversalCacheManager.set(cacheKey, entry);
        } else {
          memoryCache.set(cacheKey, entry);
        }
        
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        
        // Increment retry count
        retryCountRef.current += 1;
        
        if (import.meta.env.DEV) {
          console.warn(`useInfiniteApi [${cacheKey}]: Initial fetch failed (attempt ${retryCountRef.current}/${maxRetries}):`, errorMessage);
        }
        
        setError(errorMessage);
        
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
        
        ApiUtils.cleanupRequest(controller, abortControllerRef);
      }
    };

    fetchFirstPage();

    // Cleanup function - abort any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [enabled, cacheKey, pages.length, fetcher, limit, cacheTtl, persistentCache, maxRetries]);

  // Flatten pages data for easy consumption
  const flatData = pages.reduce<T[]>((acc, page) => [...acc, ...page.data], []);

  return {
    data: flatData,
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