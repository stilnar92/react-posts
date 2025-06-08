import { useMemo } from 'react';

/**
 * Configuration for useFilterPanel hook
 */
export interface UseFilterPanelConfig {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Current selected user ID */
  selectedUserId?: number | undefined;
  /** Callback when user filter changes */
  onUserFilterChange: (userId: number | undefined) => void;
}

/**
 * Filter actions interface
 */
export interface FilterActions {
  /** Clear search query */
  clearSearch: () => void;
  /** Clear user filter */
  clearUserFilter: () => void;
  /** Clear all filters */
  clearAllFilters: () => void;
}

/**
 * Filter state interface
 */
export interface FilterState {
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Whether search is active */
  hasActiveSearch: boolean;
  /** Whether user filter is active */
  hasActiveUserFilter: boolean;
  /** Count of active filters */
  activeFiltersCount: number;
}

/**
 * useFilterPanel hook return interface
 */
export interface UseFilterPanelReturn {
  /** Current filter state */
  state: FilterState;
  /** Filter actions */
  actions: FilterActions;
  /** Search-specific state and actions */
  search: {
    value: string;
    isActive: boolean;
    clear: () => void;
    onChange: (value: string) => void;
  };
  /** User filter-specific state and actions */
  userFilter: {
    value: number | undefined;
    isActive: boolean;
    clear: () => void;
    onChange: (userId: number | undefined) => void;
  };
}

/**
 * Headless hook for FilterPanel component logic
 * 
 * Features:
 * - Centralized filter state management
 * - Individual filter actions (clear search, clear user filter)
 * - Bulk actions (clear all filters)
 * - Computed state (active filters detection)
 * - Separation of concerns (search vs user filter)
 * - Memoized calculations for performance
 * - Clean API for UI components
 * 
 * @param config - Configuration object
 * @returns Object with filter state and actions
 */
export function useFilterPanel({
  searchQuery,
  onSearchChange,
  selectedUserId,
  onUserFilterChange,
}: UseFilterPanelConfig): UseFilterPanelReturn {
  
  // Compute filter state with memoization for performance
  const state = useMemo((): FilterState => {
    const hasActiveSearch = Boolean(searchQuery.trim());
    const hasActiveUserFilter = selectedUserId !== undefined;
    const hasActiveFilters = hasActiveSearch || hasActiveUserFilter;
    
    const activeFiltersCount = [hasActiveSearch, hasActiveUserFilter].filter(Boolean).length;
    
    return {
      hasActiveFilters,
      hasActiveSearch,
      hasActiveUserFilter,
      activeFiltersCount,
    };
  }, [searchQuery, selectedUserId]);

  // Create filter actions
  const actions = useMemo((): FilterActions => ({
    clearSearch: () => {
      onSearchChange('');
    },
    
    clearUserFilter: () => {
      onUserFilterChange(undefined);
    },
    
    clearAllFilters: () => {
      onSearchChange('');
      onUserFilterChange(undefined);
    },
  }), [onSearchChange, onUserFilterChange]);

  // Create search-specific interface
  const search = useMemo(() => ({
    value: searchQuery,
    isActive: state.hasActiveSearch,
    clear: actions.clearSearch,
    onChange: onSearchChange,
  }), [searchQuery, state.hasActiveSearch, actions.clearSearch, onSearchChange]);

  // Create user filter-specific interface
  const userFilter = useMemo(() => ({
    value: selectedUserId,
    isActive: state.hasActiveUserFilter,
    clear: actions.clearUserFilter,
    onChange: onUserFilterChange,
  }), [selectedUserId, state.hasActiveUserFilter, actions.clearUserFilter, onUserFilterChange]);

  // Debug logging in dev mode
  if (import.meta.env.DEV) {
    console.log('useFilterPanel: current state', {
      searchQuery,
      selectedUserId,
      state,
    });
  }

  return {
    state,
    actions,
    search,
    userFilter,
  };
} 