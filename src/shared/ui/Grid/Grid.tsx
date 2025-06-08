import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Grid component variants using CVA
 * Supports responsive grid layouts with configurable columns and gaps
 */
const gridVariants = cva(
  // Base styles - CSS Grid
  'grid',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        auto: 'grid-cols-auto-fit',
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-2',
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-items-start',
        center: 'justify-items-center',
        end: 'justify-items-end',
        stretch: 'justify-items-stretch',
      },
    },
    defaultVariants: {
      cols: 1,
      gap: 'md',
      align: 'stretch',
      justify: 'stretch',
    },
  }
);

/**
 * Grid component props interface
 */
export interface GridProps extends VariantProps<typeof gridVariants> {
  /** Grid content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Grid component for responsive grid layouts
 * 
 * Features:
 * - Responsive column layouts (1-4 columns)
 * - Configurable gaps and spacing
 * - Item alignment and justification
 * - CVA-based styling for type safety
 * - Mobile-first responsive design
 * 
 * Grid breakpoints:
 * - cols=1: Always 1 column
 * - cols=2: 1 column on mobile, 2 on tablet+
 * - cols=3: 1 column on mobile, 2 on tablet, 3 on desktop
 * - cols=4: 1 column on mobile, 2 on tablet, 4 on desktop
 * 
 * @param props - Grid component props
 * @returns JSX element
 */
export function Grid({
  children,
  cols,
  gap,
  align,
  justify,
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(gridVariants({ cols, gap, align, justify }), className)}
      {...props}
    >
      {children}
    </div>
  );
} 