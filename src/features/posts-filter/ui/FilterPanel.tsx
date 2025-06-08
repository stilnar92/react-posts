import { cva, type VariantProps } from 'class-variance-authority';
import { SearchInput } from '../../../shared/ui';
import { UserFilter } from './UserFilter';
import { useFilterPanel } from '../model';

/**
 * FilterPanel component variants using CVA
 */
const filterPanelVariants = cva(
  // Base panel styles
  'w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-white',
        gradient: 'bg-gradient-to-r from-blue-50 via-white to-purple-50',
        filled: 'bg-gray-50',
        outlined: 'bg-white border-2',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      spacing: {
        compact: 'p-4',
        comfortable: 'p-6',
        spacious: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'md',
      spacing: 'comfortable',
    },
  }
);

const headerVariants = cva(
  // Base header styles
  'flex items-center justify-between mb-4',
  {
    variants: {
      variant: {
        default: '',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
        simple: 'text-gray-800',
        bold: 'text-gray-900 font-bold',
      },
      size: {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
      },
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'md',
    },
  }
);

const gridVariants = cva(
  // Base grid layout styles
  'grid gap-4 items-end',
  {
    variants: {
      layout: {
        stacked: 'grid-cols-1',
        side: 'grid-cols-1 lg:grid-cols-4',
        equal: 'grid-cols-1 md:grid-cols-2',
        searchFirst: 'grid-cols-1 lg:grid-cols-4', // 3:1 ratio for search:filter
      },
      gap: {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
      },
    },
    defaultVariants: {
      layout: 'searchFirst',
      gap: 'md',
    },
  }
);

const searchSectionVariants = cva(
  // Base search section styles
  '',
  {
    variants: {
      layout: {
        stacked: '',
        side: 'lg:col-span-3',
        equal: '',
        searchFirst: 'lg:col-span-3',
      },
    },
    defaultVariants: {
      layout: 'searchFirst',
    },
  }
);

const filterSectionVariants = cva(
  // Base filter section styles
  '',
  {
    variants: {
      layout: {
        stacked: '',
        side: 'lg:col-span-1',
        equal: '',
        searchFirst: 'lg:col-span-1',
      },
    },
    defaultVariants: {
      layout: 'searchFirst',
    },
  }
);

const activeFiltersVariants = cva(
  // Base active filters styles
  'flex flex-wrap gap-2 items-center',
  {
    variants: {
      variant: {
        default: '',
        compact: 'gap-1',
        spacious: 'gap-3',
      },
      alignment: {
        left: 'justify-start',
        center: 'justify-center',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      variant: 'default',
      alignment: 'between',
    },
  }
);

/**
 * FilterPanel component props
 */
interface FilterPanelProps 
  extends VariantProps<typeof filterPanelVariants> {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Current selected user ID for filtering */
  selectedUserId?: number | undefined;
  /** Callback when user filter changes */
  onUserFilterChange: (userId: number | undefined) => void;
  /** Component variant */
  variant?: 'default' | 'gradient' | 'filled' | 'outlined';
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  /** Spacing variant */
  spacing?: 'compact' | 'comfortable' | 'spacious';
  /** Layout variant */
  layout?: 'stacked' | 'side' | 'equal' | 'searchFirst';
  /** Whether to show panel header */
  showHeader?: boolean;
  /** Custom header title */
  headerTitle?: string;
  /** Whether to show active filters summary */
  showActiveFilters?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FilterPanel component for search and user filtering
 * 
 * Features:
 * - Headless logic with useFilterPanel hook
 * - CVA styling system with multiple layout options
 * - Responsive grid layouts (stacked on mobile, side-by-side on desktop)
 * - Search input with icon and proper styling
 * - User filter dropdown with loading states
 * - Active filters summary with clear functionality
 * - Modern gradient design with customizable variants
 * - Proper spacing and accessibility
 * - Type-safe variant props
 * - Separated presentation and logic layers
 * 
 * @param props - FilterPanel component props
 * @returns JSX element
 */
export function FilterPanel({
  searchQuery,
  onSearchChange,
  selectedUserId,
  onUserFilterChange,
  variant = 'gradient',
  size = 'md',
  spacing = 'comfortable',
  layout = 'searchFirst',
  showHeader = false,
  headerTitle = 'Search & Filter',
  showActiveFilters = true,
  className,
}: FilterPanelProps) {
  
  // Use headless logic hook
  const { state, actions, search, userFilter } = useFilterPanel({
    searchQuery,
    onSearchChange,
    selectedUserId,
    onUserFilterChange,
  });
  
  // Generate CSS classes using CVA
  const panelClass = filterPanelVariants({ variant, size, spacing, className });
  const headerClass = headerVariants({ variant: showHeader ? 'gradient' : 'simple', size });
  const gridClass = gridVariants({ layout, gap: 'md' });
  const searchSectionClass = searchSectionVariants({ layout });
  const filterSectionClass = filterSectionVariants({ layout });
  const activeFiltersClass = activeFiltersVariants({ variant: 'default', alignment: 'between' });

  return (
    <div className={panelClass}>
      {/* Header */}
      {showHeader && (
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className={headerClass}>
            {headerTitle}
          </h2>
        </div>
      )}

      {/* Filters Grid */}
      <div className={gridClass}>
        {/* Search Input Section */}
        <div className={searchSectionClass}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Posts
          </label>
          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder="Search posts by title or content..."
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            variant="outlined"
            showIcon={true}
          />
        </div>

        {/* User Filter Section */}
        <div className={filterSectionClass}>
          <UserFilter
            selectedUserId={userFilter.value}
            onUserChange={userFilter.onChange}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            variant="outlined"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {showActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200 min-h-[60px]">
          {state.hasActiveFilters ? (
            <div className={activeFiltersClass}>
              <div className="flex flex-wrap gap-2">
                {/* Search Filter Tag */}
                {state.hasActiveSearch && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search: "{search.value}"
                    <button
                      onClick={search.clear}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}

                {/* User Filter Tag */}
                {state.hasActiveUserFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    User: {userFilter.value}
                    <button
                      onClick={userFilter.clear}
                      className="ml-2 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                      aria-label="Clear user filter"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>

              {/* Clear All Button */}
              <button
                onClick={actions.clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-10 text-sm text-gray-400">
              {/* Placeholder to maintain height when no filters are active */}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 