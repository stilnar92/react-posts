import { useState, useCallback } from 'react';

/**
 * Configuration for server-side filters
 */
export interface ServerFiltersConfig {
  /** Filter by user ID */
  userId?: number;
  // Future server filters can be added here:
  // category?: string;
  // dateRange?: { from: Date; to: Date };
}

/**
 * Return interface for useServerFilters hook
 */
interface UseServerFiltersReturn {
  /** Current filter configuration */
  filters: ServerFiltersConfig;
  /** Function to update filters */
  setFilters: (filters: ServerFiltersConfig) => void;
  /** Function to update a specific filter */
  updateFilter: <K extends keyof ServerFiltersConfig>(
    key: K, 
    value: ServerFiltersConfig[K]
  ) => void;
  /** Whether any filters are currently active */
  hasActiveFilters: boolean;
  /** Function to clear all filters */
  clearFilters: () => void;
  /** Function to clear a specific filter */
  clearFilter: (key: keyof ServerFiltersConfig) => void;
}

/**
 * Hook for managing server-side filters
 * 
 * Features:
 * - Type-safe filter management
 * - Individual filter updates
 * - Clear all or specific filters
 * - Active filters detection
 * - Extensible for new server filters
 * 
 * @param initialFilters - Initial filter configuration
 * @returns Object with filter state and management functions
 */
export function useServerFilters(
  initialFilters: ServerFiltersConfig = {}
): UseServerFiltersReturn {
  const [filters, setFilters] = useState<ServerFiltersConfig>(initialFilters);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  // Update a specific filter
  const updateFilter = useCallback(<K extends keyof ServerFiltersConfig>(
    key: K, 
    value: ServerFiltersConfig[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((key: keyof ServerFiltersConfig) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  if (import.meta.env.DEV) {
    console.log('useServerFilters: current filters', filters);
  }

  return {
    filters,
    setFilters,
    updateFilter,
    hasActiveFilters,
    clearFilters,
    clearFilter,
  };
} 