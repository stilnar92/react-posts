import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * LoadingSpinner component variants using CVA
 */
const spinnerVariants = cva(
  // Base styles - spinner animation and appearance
  'animate-spin rounded-full border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        xs: 'w-3 h-3 border',
        sm: 'w-4 h-4 border',
        md: 'w-5 h-5 border-2',
        lg: 'w-6 h-6 border-2',
        xl: 'w-8 h-8 border-2',
      },
      color: {
        current: 'text-current',
        blue: 'text-blue-500',
        gray: 'text-gray-400',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'current',
    },
  }
);

/**
 * LoadingSpinner component props interface
 */
export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * LoadingSpinner component for indicating loading states
 * 
 * Features:
 * - Multiple size variants
 * - Color variants for different contexts
 * - Smooth rotation animation
 * - Accessibility support
 * - CVA-based styling for type safety
 * 
 * @param props - LoadingSpinner component props
 * @returns JSX element
 */
export function LoadingSpinner({
  size,
  color,
  className,
  'aria-label': ariaLabel = 'Loading',
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, color }), className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
} 