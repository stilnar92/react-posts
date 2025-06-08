/**
 * AppHeader component props
 */
export interface AppHeaderProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * AppHeader component for displaying application header
 * 
 * Features:
 * - Main title "Social Feed"
 * - Descriptive subtitle
 * - Center-aligned layout
 * - Consistent spacing
 * 
 * Layout follows mockup design:
 * - Large prominent title
 * - Secondary subtitle text
 * - Generous vertical spacing
 * 
 * @param props - AppHeader component props
 * @returns JSX element
 */
export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header className={`text-center space-y-2 mb-12 ${className || ''}`}>
      <h1 className="text-4xl font-bold text-gray-900">
        Social Feed
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover and explore amazing posts from our community
      </p>
    </header>
  );
} 