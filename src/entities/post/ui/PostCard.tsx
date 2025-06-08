import { Card } from '../../../shared/ui';
import { PostCardHeader } from './PostCard/PostCardHeader';
import { PostCardContent } from './PostCard/PostCardContent';
import type { Post } from '../../../shared/types';

/**
 * PostCard component props
 */
export interface PostCardProps {
  /** Post data to display */
  post: Post;
  /** Click handler for post interaction */
  onClick?: (post: Post) => void;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * PostCard component for displaying individual posts in feed
 * 
 * Features:
 * - Composed from smaller, reusable components
 * - User avatar with correct colors
 * - User name and ID display
 * - Post title and body with text truncation
 * - Hover effects for interactivity
 * - Click handling for modal opening
 * - Clean separation of concerns
 * 
 * Architecture:
 * - Uses PostCardHeader for user info
 * - Uses PostCardContent for post content
 * - Wrapped in shared Card component
 * - No Context API - simple prop drilling
 * 
 * @param props - PostCard component props
 * @returns JSX element
 */
export function PostCard({ post, onClick, className }: PostCardProps) {
  const isClickable = !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(post);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      hover={isClickable ? "lift" : "none"}
      clickable={isClickable}
      onClick={handleClick}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {/* User Info Section */}
      <PostCardHeader userId={post.userId} />

      {/* Post Content Section */}
      <PostCardContent title={post.title} body={post.body} />
    </Card>
  );
} 