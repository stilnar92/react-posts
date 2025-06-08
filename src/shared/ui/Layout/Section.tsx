import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Section component variants using CVA
 */
const sectionVariants = cva(
  // Base styles
  '',
  {
    variants: {
      spacing: {
        none: '',
        xs: 'space-y-2',
        sm: 'space-y-4',
        md: 'space-y-6',
        lg: 'space-y-8',
        xl: 'space-y-12',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      background: {
        none: '',
        white: 'bg-white',
        gray: 'bg-gray-50',
      },
      rounded: {
        none: '',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-lg',
      },
    },
    defaultVariants: {
      spacing: 'md',
      padding: 'none',
      background: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

/**
 * Section component props
 */
export interface SectionProps extends VariantProps<typeof sectionVariants> {
  /** Section content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string | undefined;
  /** HTML tag to use */
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
}

/**
 * Section component for organizing page content
 * 
 * Features:
 * - Semantic HTML elements
 * - Configurable spacing and styling
 * - CVA-based variants
 * - Flexible layout options
 * 
 * @param props - Section component props
 * @returns JSX element
 */
export function Section({
  children,
  spacing,
  padding,
  background,
  rounded,
  shadow,
  className,
  as: Component = 'section',
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        sectionVariants({ spacing, padding, background, rounded, shadow }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
} 