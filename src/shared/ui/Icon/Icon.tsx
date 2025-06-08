import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Icon component variants using CVA
 * Supports different sizes and colors for SVG icons
 */
const iconVariants = cva(
  // Base styles - common for all icons
  'inline-block shrink-0',
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
      },
      color: {
        current: 'text-current',
        gray: 'text-gray-500',
        red: 'text-red-500',
        blue: 'text-blue-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'current',
    },
  }
);

/**
 * Icon component props interface
 */
export interface IconProps extends VariantProps<typeof iconVariants> {
  /** Icon content (SVG elements) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Whether icon is decorative only */
  'aria-hidden'?: boolean;
}

/**
 * Icon component for displaying SVG icons with consistent sizing and coloring
 * 
 * Features:
 * - Multiple size variants (xs to xl)
 * - Color variants for different contexts
 * - Accessibility support with ARIA attributes
 * - CVA-based styling for type safety
 * - Headless pattern - accepts any SVG content
 * - Support for both stroke and fill-based icons
 * 
 * @param props - Icon component props
 * @returns JSX element
 */
export function Icon({ 
  children, 
  size, 
  color, 
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = !ariaLabel,
  ...props 
}: IconProps) {
  return (
    <svg
      className={cn(iconVariants({ size, color }), className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : 'presentation'}
      {...props}
    >
      {children}
    </svg>
  );
} 