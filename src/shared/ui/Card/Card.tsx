import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Card component variants using CVA
 * Supports different shadow levels and hover effects
 */
const cardVariants = cva(
  // Base styles - common for all cards
  'bg-white rounded-lg border border-gray-200 transition-all duration-200',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-lg hover:-translate-y-1',
        glow: 'hover:shadow-md hover:shadow-blue-100',
      },
    },
    defaultVariants: {
      shadow: 'sm',
      padding: 'md',
      hover: 'none',
    },
  }
);

/**
 * Card component props interface
 */
export interface CardProps extends VariantProps<typeof cardVariants> {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string | undefined;
  /** Click handler */
  onClick?: () => void;
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /** Whether the card is clickable */
  clickable?: boolean;
}

/**
 * Card component for displaying content in elevated containers
 * 
 * Features:
 * - Multiple shadow variants
 * - Padding options
 * - Hover effects for interactive cards
 * - CVA-based styling for type safety
 * 
 * @param props - Card component props
 * @returns JSX element
 */
export function Card({ 
  children, 
  shadow, 
  padding, 
  hover, 
  className, 
  onClick,
  onKeyDown,
  clickable = false,
  ...props 
}: CardProps) {
  const isInteractive = clickable || onClick;
  
  return (
    <div
      className={cn(
        cardVariants({ shadow, padding, hover }), 
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
} 