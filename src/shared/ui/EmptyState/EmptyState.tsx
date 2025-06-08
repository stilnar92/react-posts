import { Icon } from '../Icon/Icon';
import { DocumentIcon } from '../Icon/icons';
import { cn } from '../../lib/utils';

/**
 * EmptyState component props interface
 */
export interface EmptyStateProps {
  /** Main heading text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action handler */
  onAction?: () => void;
  /** Custom action button text */
  actionText?: string;
  /** Additional CSS classes */
  className?: string | undefined;
  /** Custom icon */
  icon?: React.ReactNode;
}

/**
 * EmptyState component for displaying empty states with optional actions
 * 
 * Features:
 * - Consistent empty state UI across application
 * - Optional call-to-action functionality
 * - Accessible with proper ARIA attributes
 * - Customizable icon and messaging
 * - Responsive design
 * 
 * @param props - EmptyState component props
 * @returns JSX element
 */
export function EmptyState({
  title,
  description,
  onAction,
  actionText = 'Get Started',
  className,
  icon,
  ...props
}: EmptyStateProps) {
  const defaultIcon = (
    <Icon size="xl" color="gray" aria-label="Empty state icon">
      <DocumentIcon />
    </Icon>
  );

  return (
    <div
      className={cn(
        'text-center py-12 px-4',
        className
      )}
      {...props}
    >
      <div className="text-gray-500 max-w-md mx-auto">
        {icon || defaultIcon}
        
        <h3 className="text-lg font-semibold text-gray-900 mt-4">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 mt-2">
            {description}
          </p>
        )}
        
        {onAction && (
          <button
            onClick={onAction}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
} 