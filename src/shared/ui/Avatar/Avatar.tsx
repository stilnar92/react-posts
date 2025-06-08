import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Avatar component variants using CVA
 * Supports different sizes and color schemes for user avatars
 */
const avatarVariants = cva(
  // Base styles - common for all avatars
  'inline-flex items-center justify-center rounded-full font-semibold select-none',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
      },
      color: {
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white', 
        purple: 'bg-purple-500 text-white',
        pink: 'bg-pink-500 text-white',
        gray: 'bg-gray-500 text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'gray',
    },
  }
);

/**
 * Avatar component props interface
 */
export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** Avatar content (usually initials) */
  children: React.ReactNode;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * Avatar component for displaying user initials with color-coded backgrounds
 * 
 * Features:
 * - Multiple sizes (sm, md, lg)
 * - Color variants for different users
 * - Accessibility support with alt text
 * - CVA-based styling for type safety
 * 
 * @param props - Avatar component props
 * @returns JSX element
 */
export function Avatar({ 
  children, 
  size, 
  color, 
  className, 
  alt,
  ...props 
}: AvatarProps) {
  return (
    <div
      className={cn(avatarVariants({ size, color }), className)}
      role="img"
      aria-label={alt}
      {...props}
    >
      {children}
    </div>
  );
} 