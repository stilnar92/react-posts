import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Modal component variants using CVA
 */
const modalOverlayVariants = cva(
  // Base overlay styles with lighter background
  'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
  {
    variants: {
      state: {
        open: 'bg-black bg-opacity-20 backdrop-blur-sm', // Lighter background
        closed: 'bg-transparent backdrop-blur-none pointer-events-none',
      },
      blur: {
        none: '',
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
      },
    },
    defaultVariants: {
      state: 'closed',
      blur: 'sm',
    },
  }
);

const modalContentVariants = cva(
  // Base modal content styles
  'relative bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-hidden transition-all duration-300',
  {
    variants: {
      size: {
        xs: 'w-full max-w-xs',
        sm: 'w-full max-w-md',
        md: 'w-full max-w-lg',
        lg: 'w-full max-w-2xl',
        xl: 'w-full max-w-4xl',
        full: 'w-full max-w-screen-lg',
      },
      state: {
        open: 'scale-100 opacity-100',
        closed: 'scale-95 opacity-0',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'closed',
    },
  }
);

/**
 * Modal component props
 */
export interface ModalProps extends VariantProps<typeof modalContentVariants> {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Backdrop blur intensity */
  blur?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether clicking outside closes modal */
  closeOnBackdropClick?: boolean;
  /** Additional CSS classes for overlay */
  overlayClassName?: string;
  /** Additional CSS classes for content */
  className?: string;
  /** ARIA label for modal */
  ariaLabel?: string;
  /** ARIA described by for modal */
  ariaDescribedBy?: string;
}

/**
 * General-purpose Modal component
 * 
 * Features:
 * - CVA styling system with multiple size variants
 * - Lighter backdrop for better content visibility
 * - Click outside to close (configurable)
 * - Smooth transitions and animations
 * - Accessible design with ARIA attributes
 * - Responsive design with max heights
 * - Configurable backdrop blur
 * - Portal rendering support
 * 
 * Usage:
 * ```tsx
 * <Modal isOpen={isOpen} onClose={onClose} size="lg">
 *   <div>Modal content</div>
 * </Modal>
 * ```
 * 
 * @param props - Modal component props
 * @returns JSX element
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  blur = 'sm',
  closeOnBackdropClick = true,
  overlayClassName,
  className,
  ariaLabel,
  ariaDescribedBy,
}: ModalProps) {
  
  // Don't render if modal is not open
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Generate CSS classes using CVA
  const overlayClass = modalOverlayVariants({ 
    state: isOpen ? 'open' : 'closed', 
    blur 
  });
  const contentClass = modalContentVariants({ 
    size, 
    state: isOpen ? 'open' : 'closed' 
  });

  return (
    <div
      className={cn(overlayClass, overlayClassName)}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <div className={cn(contentClass, className)}>
        {children}
      </div>
    </div>
  );
} 