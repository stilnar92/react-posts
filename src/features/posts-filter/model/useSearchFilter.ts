import { useMemo } from 'react';

/**
 * Configuration for useSearchFilter hook
 */
export interface UseSearchFilterConfig {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Minimum characters to start searching */
  minLength?: number;
  /** Whether component is disabled */
  disabled?: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
}

/**
 * Search filter state interface
 */
export interface SearchFilterState {
  /** Whether search has a value */
  hasValue: boolean;
  /** Whether search is active (meets minimum length) */
  isActive: boolean;
  /** Whether component is disabled */
  isDisabled: boolean;
  /** Current search value length */
  valueLength: number;
  /** Whether search meets minimum length requirement */
  meetsMinLength: boolean;
}

/**
 * Search filter actions interface
 */
export interface SearchFilterActions {
  /** Clear search value */
  clear: () => void;
  /** Set search value */
  setValue: (value: string) => void;
  /** Handle input change event */
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handle clear button click */
  handleClear: () => void;
}

/**
 * useSearchFilter hook return interface
 */
export interface UseSearchFilterReturn {
  /** Current search value */
  value: string;
  /** Current filter state */
  state: SearchFilterState;
  /** Filter actions */
  actions: SearchFilterActions;
  /** Computed input props for easier integration */
  inputProps: {
    value: string;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

/**
 * Headless hook for SearchFilter component logic
 * 
 * Features:
 * - Search value management with validation
 * - Minimum length validation for active search
 * - Disabled state handling
 * - Clear functionality
 * - Input event handling
 * - Ready-to-use input props
 * - Memoized calculations for performance
 * - Extensible for future features (debouncing, etc.)
 * 
 * @param config - Configuration object
 * @returns Object with search value, state, and actions
 */
export function useSearchFilter({
  value,
  onChange,
  minLength = 1,
  disabled = false,
}: UseSearchFilterConfig): UseSearchFilterReturn {
  
  // Compute search state with memoization
  const state = useMemo((): SearchFilterState => {
    const trimmedValue = value.trim();
    const hasValue = Boolean(trimmedValue);
    const valueLength = trimmedValue.length;
    const meetsMinLength = valueLength >= minLength;
    const isActive = hasValue && meetsMinLength;
    
    return {
      hasValue,
      isActive,
      isDisabled: disabled,
      valueLength,
      meetsMinLength,
    };
  }, [value, minLength, disabled]);

  // Create search actions
  const actions = useMemo((): SearchFilterActions => ({
    clear: () => {
      onChange('');
    },
    
    setValue: (newValue: string) => {
      onChange(newValue);
    },
    
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    
    handleClear: () => {
      onChange('');
    },
  }), [onChange]);

  // Create ready-to-use input props
  const inputProps = useMemo(() => ({
    value,
    disabled,
    onChange: actions.handleInputChange,
  }), [value, disabled, actions.handleInputChange]);

  // Debug logging in dev mode
  if (import.meta.env.DEV) {
    console.log('useSearchFilter: current state', {
      value: `"${value}"`,
      valueLength: value.length,
      state,
    });
  }

  return {
    value,
    state,
    actions,
    inputProps,
  };
} 