import type { Post, User } from '@/shared/types';

export type { Post, User };

/**
 * Post display props for UI components
 */
export interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  className?: string;
}

/**
 * Post details props for modal
 */
export interface PostDetailsProps {
  post: Post;
  onClose: () => void;
} 