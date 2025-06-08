import { UserAvatar } from '../../../user/ui/UserAvatar';
import { getUserName, getUserIdDisplay } from '../../../user/lib/userUtils';

/**
 * PostCardHeader component props
 */
export interface PostCardHeaderProps {
  /** User ID for avatar and info */
  userId: number;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * PostCardHeader component for displaying user info in post cards
 * 
 * Features:
 * - User avatar with correct colors
 * - User name and ID display
 * - Reusable across different post layouts
 * - Clean, semantic HTML structure
 * 
 * @param props - PostCardHeader component props
 * @returns JSX element
 */
export function PostCardHeader({ userId, className }: PostCardHeaderProps) {
  const userName = getUserName(userId);
  const userIdDisplay = getUserIdDisplay(userId);

  return (
    <div className={`flex items-center gap-3 mb-4 ${className || ''}`}>
      <UserAvatar userId={userId} size="lg" />
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{userName}</div>
        <div className="text-sm text-gray-500">{userIdDisplay}</div>
      </div>
    </div>
  );
} 