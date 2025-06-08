/**
 * PostCardContent component props
 */
export interface PostCardContentProps {
  /** Post title */
  title: string;
  /** Post body text */
  body: string;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * PostCardContent component for displaying post title and body
 * 
 * Features:
 * - Semantic HTML structure
 * - Text truncation with CSS
 * - Consistent typography
 * - Reusable across different post layouts
 * 
 * @param props - PostCardContent component props
 * @returns JSX element
 */
export function PostCardContent({ title, body, className }: PostCardContentProps) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed line-clamp-3">
        {body}
      </p>
    </div>
  );
} 