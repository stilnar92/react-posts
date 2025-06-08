import { useEffect, useRef, useCallback } from 'react';

/**
 * Configuration for useIntersectionObserver hook
 */
interface UseIntersectionObserverConfig {
  /** Function to call when element becomes visible */
  onIntersect: () => void;
  /** Whether the observer is enabled (default: true) */
  enabled?: boolean;
  /** Root margin for intersection (default: '100px') */
  rootMargin?: string;
  /** Threshold for intersection (default: 0.1) */
  threshold?: number;
  /** Root element for intersection (default: null = viewport) */
  root?: Element | null;
}

/**
 * Return interface for useIntersectionObserver hook
 */
interface UseIntersectionObserverReturn {
  /** Ref to attach to the target element */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Whether the target is currently intersecting */
  isIntersecting: boolean;
}

/**
 * Hook for observing element visibility with Intersection Observer API
 * 
 * Features:
 * - Modern Intersection Observer API
 * - Configurable root margin and threshold
 * - Automatic cleanup on unmount
 * - TypeScript support
 * - Performance optimized
 * 
 * @param config - Configuration object
 * @returns Object with target ref and intersection state
 */
export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = '100px',
  threshold = 0.1,
  root = null,
}: UseIntersectionObserverConfig): UseIntersectionObserverReturn {
  const targetRef = useRef<HTMLElement>(null);
  const isIntersectingRef = useRef<boolean>(false);
  
  // Stable callback reference
  const stableOnIntersect = useCallback(onIntersect, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;
    
    if (import.meta.env.DEV) {
      console.log('IntersectionObserver: useEffect called', { enabled, target: !!target });
    }
    
    // Early return if observer is disabled or target not found
    if (!enabled || !target) {
      if (import.meta.env.DEV) {
        console.log('IntersectionObserver: Early return', { enabled, target: !!target });
      }
      return;
    }

    // Check if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      if (import.meta.env.DEV) {
        console.warn('IntersectionObserver is not supported in this browser');
      }
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          
          if (import.meta.env.DEV) {
            console.log(`IntersectionObserver: isIntersecting=${isIntersecting}`, entry);
          }
          
          // Update intersection state
          isIntersectingRef.current = isIntersecting;
          
          // Call onIntersect when element becomes visible
          if (isIntersecting) {
            if (import.meta.env.DEV) {
              console.log('IntersectionObserver: Calling onIntersect');
            }
            stableOnIntersect();
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    // Start observing the target element
    observer.observe(target);

    if (import.meta.env.DEV) {
      console.log('IntersectionObserver: Started observing element', { rootMargin, threshold, target });
    }

    // Cleanup function
    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
      
      if (import.meta.env.DEV) {
        console.log('IntersectionObserver: Cleaned up observer');
      }
    };
  }, [enabled, rootMargin, threshold, root, stableOnIntersect]);

  return {
    targetRef,
    isIntersecting: isIntersectingRef.current,
  };
} 