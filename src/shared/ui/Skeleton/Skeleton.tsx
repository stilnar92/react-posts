import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Skeleton component variants using CVA
 * Supports different shapes and sizes for loading states
 */
const skeletonVariants = cva(
  // Base styles for skeleton loading animation
  'animate-pulse bg-gray-200',
  {
    variants: {
      shape: {
        text: 'rounded',
        circle: 'rounded-full',
        rectangle: 'rounded-md',
      },
      size: {
        xs: 'w-4 h-4',
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
      },
      width: {
        full: 'w-full',
        '3/4': 'w-3/4',
        '1/2': 'w-1/2',
        '1/3': 'w-1/3',
        '1/4': 'w-1/4',
        '1/6': 'w-1/6',
        '2/3': 'w-2/3',
      },
      height: {
        '1': 'h-1',
        '2': 'h-2',
        '3': 'h-3',
        '4': 'h-4',
        '5': 'h-5',
        '6': 'h-6',
        '8': 'h-8',
        '10': 'h-10',
        '12': 'h-12',
        '16': 'h-16',
      },
    },
    defaultVariants: {
      shape: 'text',
      width: 'full',
      height: '4',
    },
  }
);

/**
 * Skeleton component props interface
 */
export interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton component for displaying loading placeholders
 * 
 * Features:
 * - Multiple shape variants (rectangle, circle, text)
 * - Size presets or custom width/height
 * - Smooth pulse animation
 * - CVA-based styling for type safety
 * - Accessibility-friendly (screen readers ignore)
 * 
 * @param props - Skeleton component props
 * @returns JSX element
 */
export function Skeleton({ 
  shape, 
  size, 
  width, 
  height, 
  className,
  ...props 
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ shape, size, width, height }), className)}
      aria-hidden="true"
      {...props}
    />
  );
} 