import { Skeleton } from '../../../shared/ui';

/**
 * PostCardSkeleton component props
 */
export interface PostCardSkeletonProps {
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * PostCardSkeleton component for post loading states
 * 
 * Features:
 * - Uses shared Skeleton components
 * - Matches PostCard layout structure
 * - Accessibility-friendly
 * - Consistent with post card design
 * 
 * Layout structure:
 * - User avatar skeleton (circle)
 * - User info skeleton (text lines)
 * - Post title skeleton (text)
 * - Post body skeleton (multiple text lines)
 * 
 * @param props - PostCardSkeleton component props
 * @returns JSX element
 */
export function PostCardSkeleton({ className }: PostCardSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className || ''}`}>
      {/* User Info Skeleton */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar Skeleton */}
        <Skeleton shape="circle" size="lg" />
        
        <div className="flex-1 space-y-2">
          {/* User name skeleton */}
          <Skeleton shape="text" width="1/4" height="4" />
          {/* User ID skeleton */}
          <Skeleton shape="text" width="1/6" height="3" />
        </div>
      </div>
      
      {/* Post Content Skeleton */}
      <div className="space-y-3">
        {/* Post title skeleton */}
        <Skeleton shape="text" width="3/4" height="5" />
        
        {/* Post body skeleton */}
        <div className="space-y-2">
          <Skeleton shape="text" width="full" height="4" />
          <Skeleton shape="text" width="full" height="4" />
          <Skeleton shape="text" width="2/3" height="4" />
        </div>
      </div>
    </div>
  );
} 