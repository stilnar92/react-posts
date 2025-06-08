import { useState, useCallback } from 'react';

/**
 * Debug mode configuration
 */
export interface DebugConfig {
  /** Whether to show debug info by default */
  enabled?: boolean;
}

/**
 * Debug mode hook return interface
 */
export interface UseDebugModeReturn {
  /** Whether debug mode is active */
  isDebugMode: boolean;
  /** Toggle debug mode */
  toggleDebugMode: () => void;
  /** Clear all caches and reload page */
  clearCacheAndReload: () => void;
}

/**
 * Hook for debug mode functionality
 * 
 * Features:
 * - Debug mode toggle
 * - Cache clearing functionality
 * - Development environment detection
 * 
 * @param config - Debug configuration
 * @returns Debug mode state and actions
 */
export function useDebugMode({
  enabled = false,
}: DebugConfig = {}): UseDebugModeReturn {
  const [isDebugMode, setIsDebugMode] = useState(() => {
    return import.meta.env.DEV ? enabled : false;
  });

  const toggleDebugMode = useCallback(() => {
    if (import.meta.env.DEV) {
      setIsDebugMode(prev => !prev);
    }
  }, []);

  const clearCacheAndReload = useCallback(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reload page
    window.location.reload();
  }, []);

  return {
    isDebugMode,
    toggleDebugMode,
    clearCacheAndReload,
  };
} 