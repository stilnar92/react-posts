import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '../Icon';
import { SearchIcon } from '../Icon/icons';

/**
 * SearchInput component variants using CVA
 */
const searchInputVariants = cva(
  // Base styles
  'relative flex items-center w-full transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      },
      variant: {
        default: 'bg-white border border-gray-300 rounded-lg',
        filled: 'bg-gray-50 border border-gray-200 rounded-lg',
        outlined: 'bg-white border-2 border-gray-300 rounded-lg',
        ghost: 'bg-transparent border border-transparent rounded-lg',
      },
      state: {
        default: '',
        focused: '',
        error: '',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      state: 'default',
    },
  }
);

const inputVariants = cva(
  // Base input styles
  'w-full bg-transparent border-none outline-none focus:outline-none placeholder-gray-500 text-gray-900',
  {
    variants: {
      size: {
        sm: 'text-sm px-3 pl-9',
        md: 'text-base px-4 pl-10',
        lg: 'text-lg px-5 pl-12',
      },
      state: {
        default: '',
        focused: '',
        error: 'text-red-900 placeholder-red-400',
        disabled: 'cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

const iconVariants = cva(
  // Base icon styles
  'absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
  {
    variants: {
      size: {
        sm: 'ml-2',
        md: 'ml-3',
        lg: 'ml-4',
      },
      state: {
        default: 'text-gray-400',
        focused: 'text-blue-500',
        error: 'text-red-500',
        disabled: 'text-gray-300',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * SearchInput component props
 */
export interface SearchInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>,
    VariantProps<typeof searchInputVariants> {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Component size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  /** Component state */
  state?: 'default' | 'focused' | 'error' | 'disabled';
  /** Whether to show search icon */
  showIcon?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether component is disabled */
  disabled?: boolean;
}

/**
 * SearchInput component for search functionality
 * 
 * Features:
 * - Enhanced CVA styling system with multiple variants
 * - Search icon integration with state-based coloring
 * - Multiple size variants (sm, md, lg)
 * - Multiple visual variants (default, filled, outlined, ghost)
 * - State management (default, focused, error, disabled)
 * - Error state handling with proper styling
 * - Accessible design with ARIA attributes
 * - Forward ref support for form libraries
 * - Type-safe props with VariantProps
 * - Consistent with FilterPanel sizing
 * 
 * @param props - SearchInput component props
 * @returns JSX element
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  value,
  onChange,
  size = 'md',
  variant = 'default',
  state = 'default',
  showIcon = true,
  error,
  className,
  disabled = false,
  placeholder = 'Search posts by title or content...',
  ...props
}, ref) => {
  // Determine actual state based on error and disabled props
  const actualState = error ? 'error' : disabled ? 'disabled' : state;
  
  // Generate CSS classes using CVA
  const containerClass = searchInputVariants({ 
    size, 
    variant, 
    state: actualState,
    className 
  });
  
  const inputClass = inputVariants({ size, state: actualState });
  const iconContainerClass = iconVariants({ size, state: actualState });

  // Map size to icon size for consistency
  const iconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';

  // Create dynamic focus styles based on error state
  const focusStyles = error 
    ? 'focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 focus-within:outline-none'
    : 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:outline-none';

  return (
    <div>
      <div className={`${containerClass} ${focusStyles}`}>
        {showIcon && (
          <div className={iconContainerClass}>
            <Icon 
              size={iconSize}
              color={actualState === 'error' ? 'red' : actualState === 'focused' ? 'blue' : 'gray'}
              aria-hidden={true}
            >
              <SearchIcon />
            </Icon>
          </div>
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClass} focus:outline-none focus:ring-0 focus:border-transparent`}
          aria-label="Search posts"
          aria-invalid={!!error}
          aria-describedby={error ? 'search-error' : undefined}
          style={{ outline: 'none', boxShadow: 'none' }}
          {...props}
        />
      </div>
      
      {error && (
        <p 
          id="search-error"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput'; 