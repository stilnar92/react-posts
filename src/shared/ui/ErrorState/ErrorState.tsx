import { Icon } from '../Icon/Icon';
import { ErrorIcon } from '../Icon/icons';
import { cn } from '../../lib/utils';

/**
 * ErrorState component props interface
 */
export interface ErrorStateProps {
  /** Error message to display */
  message: string;
  /** Optional detailed error description */
  description?: string;
  /** Retry action handler */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
  /** Additional CSS classes */
  className?: string | undefined;
  /** Custom icon */
  icon?: React.ReactNode;
}

/**
 * ErrorState component for displaying error messages with retry functionality
 * 
 * Features:
 * - Consistent error UI across application
 * - Optional retry functionality
 * - Accessible with proper ARIA attributes
 * - Customizable icon and messaging
 * - Responsive design
 * 
 * @param props - ErrorState component props
 * @returns JSX element
 */
export function ErrorState({
  message,
  description,
  onRetry,
  retryText = 'Try Again',
  className,
  icon,
  ...props
}: ErrorStateProps) {
  const defaultIcon = (
    <Icon size="xl" color="red" aria-label="Error icon">
      <ErrorIcon />
    </Icon>
  );

  return (
    <div
      className={cn(
        'text-center py-12 px-4',
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-600 mb-4">
          {icon || defaultIcon}
          
          <h3 className="text-lg font-semibold mt-2 text-red-900">
            {message}
          </h3>
          
          {description && (
            <p className="text-sm text-red-700 mt-1">
              {description}
            </p>
          )}
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
} 