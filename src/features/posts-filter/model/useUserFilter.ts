import { useMemo } from 'react';
import { useUsers } from '../../../entities/user';

/**
 * Configuration for useUserFilter hook
 */
export interface UseUserFilterConfig {
  /** Current selected user ID */
  selectedUserId?: number | undefined;
  /** Callback when user selection changes */
  onUserChange: (userId: number | undefined) => void;
  /** Whether component is disabled */
  disabled?: boolean;
}

/**
 * User filter state interface
 */
export interface UserFilterState {
  /** Whether a user is selected */
  hasSelection: boolean;
  /** Whether the filter is loading */
  isLoading: boolean;
  /** Whether there's an error */
  isError: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the component should be disabled */
  isDisabled: boolean;
  /** Currently selected user data */
  selectedUser: { id: number; name: string } | null;
}

/**
 * User filter actions interface
 */
export interface UserFilterActions {
  /** Select a user by ID */
  selectUser: (userId: number) => void;
  /** Clear user selection */
  clearSelection: () => void;
  /** Handle select element change */
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * useUserFilter hook return interface
 */
export interface UseUserFilterReturn {
  /** Available users list */
  users: Array<{ id: number; name: string; initials: string }>;
  /** Current filter state */
  state: UserFilterState;
  /** Filter actions */
  actions: UserFilterActions;
  /** Computed select props for easier integration */
  selectProps: {
    value: string;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };
}

/**
 * Headless hook for UserFilter component logic
 * 
 * Features:
 * - Users data fetching and management
 * - Selection state management
 * - Error and loading state handling
 * - Automatic state computation (disabled state based on loading/error)
 * - Clean actions API (select, clear, handleChange)
 * - Ready-to-use select props
 * - Selected user data resolution
 * - Memoized calculations for performance
 * 
 * @param config - Configuration object
 * @returns Object with users data, state, and actions
 */
export function useUserFilter({
  selectedUserId,
  onUserChange,
  disabled = false,
}: UseUserFilterConfig): UseUserFilterReturn {
  
  // Fetch users data
  const { 
    users, 
    isLoading, 
    isError, 
    error: apiError 
  } = useUsers();

  // Compute filter state with memoization
  const state = useMemo((): UserFilterState => {
    const hasSelection = selectedUserId !== undefined;
    const isDisabled = disabled || isLoading;
    const error = isError ? (apiError || 'Failed to load users') : null;
    
    // Find selected user data
    const selectedUser = hasSelection 
      ? users.find(user => user.id === selectedUserId) || null
      : null;

    return {
      hasSelection,
      isLoading,
      isError,
      error,
      isDisabled,
      selectedUser: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : null,
    };
  }, [selectedUserId, disabled, isLoading, isError, apiError, users]);

  // Create filter actions
  const actions = useMemo((): UserFilterActions => ({
    selectUser: (userId: number) => {
      onUserChange(userId);
    },
    
    clearSelection: () => {
      onUserChange(undefined);
    },
    
    handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      onUserChange(value ? parseInt(value, 10) : undefined);
    },
  }), [onUserChange]);

  // Create ready-to-use select props
  const selectProps = useMemo(() => ({
    value: selectedUserId?.toString() || '',
    disabled: state.isDisabled,
    onChange: actions.handleSelectChange,
  }), [selectedUserId, state.isDisabled, actions.handleSelectChange]);

  // Debug logging in dev mode
  if (import.meta.env.DEV) {
    console.log('useUserFilter: current state', {
      selectedUserId,
      usersCount: users.length,
      state,
    });
  }

  return {
    users,
    state,
    actions,
    selectProps,
  };
} 