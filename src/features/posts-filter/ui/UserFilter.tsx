import { cva, type VariantProps } from 'class-variance-authority';
import { useUsers } from '../../../entities/user';
import { User } from '../../../shared/types';

/**
 * UserFilter component variants using CVA
 */
const userFilterVariants = cva(
  // Base styles for the container
  'relative',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const selectVariants = cva(
  // Base select styles
  'block w-full border rounded-lg bg-white transition-all duration-200 appearance-none focus:outline-none',
  {
    variants: {
      size: {
        sm: 'h-8 pl-8 pr-8 text-sm',
        md: 'h-10 pl-10 pr-10 text-base',
        lg: 'h-12 pl-12 pr-12 text-lg',
      },
      variant: {
        default: 'border-gray-300',
        outlined: 'border-2 border-gray-300',
        filled: 'border-gray-200 bg-gray-50',
      },
      state: {
        default: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error: 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500',
        disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
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
        sm: 'ml-2 w-4 h-4',
        md: 'ml-3 w-5 h-5',
        lg: 'ml-4 w-6 h-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const dropdownIconVariants = cva(
  // Base dropdown arrow styles
  'absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
  {
    variants: {
      size: {
        sm: 'mr-2 w-4 h-4',
        md: 'mr-3 w-5 h-5',
        lg: 'mr-4 w-6 h-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const loadingSpinnerVariants = cva(
  // Base loading spinner styles
  'absolute right-0 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500',
  {
    variants: {
      size: {
        sm: 'mr-6 w-3 h-3',
        md: 'mr-8 w-4 h-4',
        lg: 'mr-10 w-5 h-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * UserFilter component props
 */
interface UserFilterProps 
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'>,
    VariantProps<typeof userFilterVariants> {
  /** Current selected user ID */
  selectedUserId?: number | undefined;
  /** Callback when user selection changes */
  onUserChange: (userId: number | undefined) => void;
  /** Component size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'filled';
  /** Component state */
  state?: 'default' | 'error' | 'disabled';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
}

/**
 * UserFilter component for filtering posts by user
 * 
 * Features:
 * - CVA styling system with size, variant, and state support
 * - Dropdown with all users from API
 * - "All Users" option to clear filter
 * - Loading state handling
 * - Error state handling
 * - Accessible select element
 * - Real data from JSONPlaceholder API
 * - Modern design with icons
 * - Responsive sizing
 * 
 * @param props - UserFilter component props
 * @returns JSX element
 */
export function UserFilter({ 
  selectedUserId, 
  onUserChange,
  size = 'md',
  variant = 'default',
  state = 'default',
  className,
  showLabel = true,
  label = 'Filter by User',
  disabled,
  ...props
}: UserFilterProps) {
  // Load users from API using project's useUsers hook
  const { 
    users, 
    isLoading, 
    isError, 
    error 
  } = useUsers();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onUserChange(value ? parseInt(value, 10) : undefined);
  };

  // Determine actual state based on loading and error states
  const actualState = isError ? 'error' : (disabled || isLoading) ? 'disabled' : state;

  // Generate CSS classes using CVA
  const containerClass = userFilterVariants({ size, className });
  const selectClass = selectVariants({ size, variant, state: actualState });
  const userIconClass = iconVariants({ size });
  const dropdownClass = dropdownIconVariants({ size });
  const spinnerClass = loadingSpinnerVariants({ size });

  if (isError) {
    return (
      <div className={containerClass}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="text-sm text-red-600 p-3 border border-red-300 rounded-lg bg-red-50">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Failed to load users: {error || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {showLabel && (
        <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* User Icon */}
        <div className={userIconClass}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        {/* Select */}
        <select
          id="user-filter"
          value={selectedUserId || ''}
          onChange={handleChange}
          disabled={isLoading || disabled}
          className={selectClass}
          aria-label="Filter posts by user"
          {...props}
        >
          <option value="">
            {isLoading ? 'Loading users...' : 'All Users'}
          </option>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className={dropdownClass}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className={spinnerClass}>
            <svg fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
} 