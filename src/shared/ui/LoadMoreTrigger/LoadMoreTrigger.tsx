import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { LoadingSpinner } from '../LoadingSpinner';

/**
 * LoadMoreTrigger component variants using CVA
 */
const loadMoreTriggerVariants = cva(
  // Base styles
  'flex items-center justify-center py-8',
  {
    variants: {
      variant: {
        auto: 'min-h-[120px]', // Auto-trigger with intersection observer
        manual: 'min-h-[80px]', // Manual button trigger
      },
    },
    defaultVariants: {
      variant: 'auto',
    },
  }
);

/**
 * LoadMoreTrigger component props
 */
export interface LoadMoreTriggerProps extends VariantProps<typeof loadMoreTriggerVariants> {
  /** Whether currently loading more data */
  loading?: boolean;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Function to call when trigger is activated */
  onLoadMore: () => void;
  /** Custom loading text */
  loadingText?: string;
  /** Custom load more button text */
  buttonText?: string;
  /** Whether auto-trigger is enabled (default: true for auto variant) */
  autoTrigger?: boolean;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * LoadMoreTrigger component for infinite scroll functionality
 * 
 * Features:
 * - Auto-trigger with Intersection Observer
 * - Manual button trigger option
 * - Loading states with spinner
 * - Customizable text and styling
 * - CVA-based variants
 * - Accessibility support
 * 
 * @param props - LoadMoreTrigger component props
 * @returns JSX element
 */
export function LoadMoreTrigger({
  variant = 'auto',
  loading = false,
  hasMore = true,
  onLoadMore,
  loadingText = 'Loading more...',
  buttonText = 'Load More',
  autoTrigger = true,
  className,
  ...props
}: LoadMoreTriggerProps) {
  
  if (import.meta.env.DEV) {
    console.log('LoadMoreTrigger render:', { variant, loading, hasMore, autoTrigger });
  }
  
  // Use intersection observer for auto-trigger
  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (import.meta.env.DEV) {
        console.log('LoadMoreTrigger: onIntersect called', { variant, autoTrigger, hasMore, loading });
      }
      if (variant === 'auto' && autoTrigger && hasMore && !loading) {
        if (import.meta.env.DEV) {
          console.log('LoadMoreTrigger: Calling onLoadMore');
        }
        onLoadMore();
      }
    },
    enabled: variant === 'auto' && autoTrigger && hasMore && !loading,
    rootMargin: '100px',
    threshold: 0.1,
  });

  if (import.meta.env.DEV) {
    console.log('LoadMoreTrigger: IntersectionObserver enabled:', variant === 'auto' && autoTrigger && hasMore && !loading);
  }

  // Don't render if no more items to load
  if (!hasMore) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        <span className="text-sm">No more posts to load</span>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div
        className={cn(loadMoreTriggerVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center gap-2 text-gray-600">
          <LoadingSpinner size="sm" color="blue" />
          <span className="text-sm">{loadingText}</span>
        </div>
      </div>
    );
  }

  // Auto variant - invisible trigger element
  if (variant === 'auto') {
    return (
      <div
        ref={targetRef as React.RefObject<HTMLDivElement>}
        className={cn(loadMoreTriggerVariants({ variant }), className)}
        {...props}
      >
        <div className="text-gray-400 text-sm">
          Scroll down for more posts
        </div>
      </div>
    );
  }

  // Manual variant - load more button
  return (
    <div
      className={cn(loadMoreTriggerVariants({ variant }), className)}
      {...props}
    >
      <button
        onClick={onLoadMore}
        disabled={loading}
        className={cn(
          'px-6 py-3 rounded-lg font-medium transition-colors',
          'bg-blue-600 text-white hover:bg-blue-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label={buttonText}
      >
        {buttonText}
      </button>
    </div>
  );
} 