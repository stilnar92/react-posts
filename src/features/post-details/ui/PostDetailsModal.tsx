import { cva } from 'class-variance-authority';
import { useUsers } from '../../../entities/user';
import { Avatar, Modal } from '../../../shared/ui';
import { Post } from '../../../shared/types';

/**
 * PostDetailsModal header variants using CVA
 */
const modalHeaderVariants = cva(
  // Base header styles
  'flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50',
);

const modalBodyVariants = cva(
  // Base body styles
  'p-6 overflow-y-auto',
);

const closeButtonVariants = cva(
  // Base close button styles
  'inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100',
);

/**
 * PostDetailsModal component props
 */
interface PostDetailsModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Post to display */
  post: Post | null;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * PostDetailsModal component for displaying post details
 * 
 * Features:
 * - Uses shared Modal component with lighter background
 * - User information integration with avatar
 * - Clean header with user info and close button
 * - Responsive design and accessibility
 * - Loading state for user data
 * - Beautiful gradient header design
 * 
 * @param props - PostDetailsModal component props
 * @returns JSX element
 */
export function PostDetailsModal({
  isOpen,
  post,
  onClose,
}: PostDetailsModalProps) {
  // Fetch users data for user information
  const { users, isLoading: usersLoading } = useUsers();

  // Don't render if no post
  if (!post) return null;

  // Find user data for the post
  const user = users.find(u => u.id === post.userId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      blur="sm"
      ariaLabel="Post details"
      ariaDescribedBy="modal-description"
    >
      {/* Modal Header */}
      <div className={modalHeaderVariants()}>
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          {user && (
            <Avatar
              size="md"
              color="blue"
              alt={`${user.name} avatar`}
              className="flex-shrink-0"
            >
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
          )}
          
          {/* User Info */}
          <div className="min-w-0 flex-1">
            {usersLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ) : user ? (
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500">
                  ID: {post.userId}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  User {post.userId}
                </h3>
                <p className="text-xs text-gray-500">
                  ID: {post.userId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className={closeButtonVariants()}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className={modalBodyVariants()}>
        {/* Post Title */}
        <h2 
          id="modal-title"
          className="text-xl font-semibold text-gray-900 mb-4 leading-tight"
        >
          {post.title}
        </h2>

        {/* Post Body */}
        <div 
          id="modal-description"
          className="text-gray-700 leading-relaxed whitespace-pre-wrap"
        >
          {post.body}
        </div>

        {/* Post Meta */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Post ID: {post.id}</span>
            <span>User ID: {post.userId}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
} 