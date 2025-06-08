import { Avatar, type AvatarProps } from '../../../shared/ui';
import { getUserInitials, getUserAvatarColor, getUserName } from '../lib/userUtils';

/**
 * UserAvatar component props
 */
export interface UserAvatarProps extends Omit<AvatarProps, 'children' | 'color' | 'alt'> {
  /** User ID for avatar display */
  userId: number;
  /** Override avatar size */
  size?: AvatarProps['size'];
}

/**
 * UserAvatar component for displaying user-specific avatars
 * 
 * Features:
 * - Automatic color assignment based on user ID
 * - User initials display (U1, U4, etc.)
 * - Accessibility with proper alt text
 * - Consistent with design system colors
 * 
 * Color mapping:
 * - User 1: Blue (#3B82F6)
 * - User 2: Green (#10B981) 
 * - User 4: Purple (#8B5CF6)
 * - User 5: Pink (#EC4899)
 * 
 * @param props - UserAvatar component props
 * @returns JSX element
 */
export function UserAvatar({ userId, size = 'md', className, ...props }: UserAvatarProps) {
  const initials = getUserInitials(userId);
  const color = getUserAvatarColor(userId);
  const userName = getUserName(userId);
  
  return (
    <Avatar
      size={size}
      color={color}
      alt={`${userName} avatar`}
      className={className}
      {...props}
    >
      {initials}
    </Avatar>
  );
} 