import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * PageLayout component variants using CVA
 */
const pageLayoutVariants = cva(
  // Base styles - full page layout
  'min-h-screen',
  {
    variants: {
      background: {
        default: 'bg-gray-50',
        white: 'bg-white',
        gray: 'bg-gray-100',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      maxWidth: {
        none: '',
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        full: 'max-w-full',
      },
      center: {
        true: 'mx-auto',
        false: '',
      },
    },
    defaultVariants: {
      background: 'default',
      padding: 'lg',
      maxWidth: 'xl',
      center: true,
    },
  }
);

/**
 * PageLayout component props
 */
export interface PageLayoutProps extends VariantProps<typeof pageLayoutVariants> {
  /** Page content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * PageLayout component for consistent page layouts
 * 
 * Features:
 * - Consistent page structure across app
 * - Responsive max-width constraints
 * - Configurable backgrounds and padding
 * - CVA-based styling for type safety
 * - Semantic HTML structure
 * 
 * @param props - PageLayout component props
 * @returns JSX element
 */
export function PageLayout({
  children,
  background,
  padding,
  maxWidth,
  center,
  className,
  ...props
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        pageLayoutVariants({ background, padding, maxWidth, center }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 