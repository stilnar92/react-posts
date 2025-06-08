import { useState } from 'react';

/**
 * Filters state interface
 */
export interface FiltersState {
  /** Search query */
  searchQuery: string;
  /** Selected user ID */
  selectedUserId: number | undefined;
}

/**
 * useFiltersState hook return interface
 */
export interface UseFiltersStateReturn {
  /** Current filters state */
  state: FiltersState;
  /** Function to change search query */
  setSearchQuery: (query: string) => void;
  /** Function to change selected user */
  setSelectedUserId: (userId: number | undefined) => void;
  /** Function to reset all filters */
  resetFilters: () => void;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
}

/**
 * Initial filters state
 */
const initialState: FiltersState = {
  searchQuery: '',
  selectedUserId: undefined,
};

/**
 * Hook for managing posts filters state
 * 
 * Features:
 * - Search query management
 * - Selected user management
 * - Reset all filters
 * - Active filters detection
 * - Simple and clear API
 * 
 * @returns object with state and management functions
 */
export function useFiltersState(): UseFiltersStateReturn {
  const [state, setState] = useState<FiltersState>(initialState);

  // Function to change search query
  const setSearchQuery = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
    }));
  };

  // Function to change selected user
  const setSelectedUserId = (userId: number | undefined) => {
    setState(prev => ({
      ...prev,
      selectedUserId: userId,
    }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setState(initialState);
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    state.searchQuery.trim() || state.selectedUserId !== undefined
  );

  // Debug logging in dev mode
  if (import.meta.env.DEV) {
    console.log('useFiltersState: current state', state);
  }

  return {
    state,
    setSearchQuery,
    setSelectedUserId,
    resetFilters,
    hasActiveFilters,
  };
} 