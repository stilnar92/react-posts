# Architecture Overview

> An overview of the code structure and key decisions

## 📚 Table of Contents

- [Architecture Philosophy](#architecture-philosophy)
- [Project Structure](#project-structure)
- [Key Technical Decisions](#key-technical-decisions)
- [Code Organization Patterns](#code-organization-patterns)
- [Data Flow Architecture](#data-flow-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Design System Architecture](#design-system-architecture)
- [State Management Strategy](#state-management-strategy)
- [Future Architecture Considerations](#future-architecture-considerations)

## 🏗️ Architecture Philosophy

### Feature-Sliced Design (FSD)

This project implements **Feature-Sliced Design**, a methodology that organizes code by business value rather than technical concerns.

#### Core Principles

1. **Business-First Organization**: Code is structured around features and entities, not technical layers
2. **Unidirectional Dependencies**: Higher layers can only import from lower layers
3. **Explicit Public API**: Each layer exposes a clear, controlled interface
4. **Isolation and Modularity**: Features are independent and loosely coupled

#### Layer Hierarchy (Bottom to Top)

```
📁 shared     # Reusable code without business context
📁 entities   # Business entities (user, post)
📁 features   # User interactions and business features
📁 widgets    # Composite UI blocks  
📁 pages      # Application pages
📁 app        # App-level configuration
```

### Why FSD Over Alternatives?

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Technical Layers** | Familiar, simple | Doesn't scale, unclear ownership | Small apps |
| **Domain-Driven** | Business-focused | Complex, over-engineered | Large enterprises |
| **Feature-Sliced** | Scalable, clear boundaries | Learning curve | Growing applications |

## 🏢 Project Structure

### Detailed Layer Breakdown

```
src/
├── 📁 app/                     # Application layer
│   ├── App.tsx                 # Root component
│   └── styles/globals.css      # Global styles
│
├── 📁 pages/                   # Pages layer
│   └── main/
│       └── ui/MainPage.tsx     # Main page component
│
├── 📁 widgets/                 # Widgets layer
│   ├── app-header/             # Application header
│   └── posts-feed/             # Posts listing widget
│
├── 📁 features/                # Features layer
│   ├── posts-filter/           # Search & filtering
│   │   ├── model/              # Business logic
│   │   └── ui/                 # UI components
│   └── post-details/           # Post detail modal
│       ├── model/              # Modal state management
│       └── ui/                 # Modal components
│
├── 📁 entities/                # Entities layer
│   ├── post/                   # Post domain
│   │   ├── model/              # Post business logic
│   │   │   ├── useInfinitePosts.ts
│   │   │   ├── usePostsWithFiltersAndSearch.ts
│   │   │   └── types.ts
│   │   └── ui/                 # Post UI components
│   │       ├── PostCard/
│   │       └── PostCardSkeleton.tsx
│   └── user/                   # User domain
│       ├── model/useUsers.ts
│       ├── lib/userUtils.ts
│       └── ui/UserAvatar.tsx
│
└── 📁 shared/                  # Shared layer
    ├── api/                    # API layer
    ├── hooks/                  # Reusable hooks
    ├── ui/                     # UI kit components
    ├── lib/                    # Utilities
    ├── types/                  # Shared types
    └── config/                 # Configuration
```

### Import Rules and Dependencies

```typescript
// ✅ Allowed imports (lower layers)
import { Button } from '@/shared/ui';
import { useUsers } from '@/entities/user';
import { PostCard } from '@/entities/post';

// ❌ Forbidden imports (higher layers)
import { PostsFilter } from '@/features/posts-filter'; // from entity
import { MainPage } from '@/pages/main';              // from widget
```

## 🎯 Key Technical Decisions

### 1. Custom Caching System vs External Libraries

**Decision**: Build custom caching with `useApi` and `useInfiniteApi`

**Reasoning**:
```typescript
// Our approach: Full control over cache behavior
const { data, loading, error } = useApi(fetcher, {
  cacheKey: 'posts',
  cacheTtl: 5 * 60 * 1000,
  persistentCache: true,
  refetchOnFocus: false
});
```

**Alternatives Considered**:
- **React Query**: Too heavy for our use case, complex API
- **SWR**: Good, but less control over caching strategy
- **Apollo Client**: Overkill for REST API

**Benefits**:
- ✅ Lightweight (no external dependencies)
- ✅ Perfect fit for our requirements
- ✅ Full control over cache invalidation
- ✅ Synchronous cache initialization prevents flicker

### 2. TypeScript Strict Mode Configuration

**Decision**: Enable all strict TypeScript checks

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Benefits**:
- ✅ Catch errors at compile time
- ✅ Better developer experience with IDE
- ✅ Self-documenting code through types
- ✅ Easier refactoring and maintenance

### 3. Headless UI + CVA Instead of Component Libraries

**Decision**: Build custom components with Headless UI pattern

```typescript
// Headless hook for behavior
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  // Focus management, scroll locking, etc.
  return { isOpen, openModal, closeModal };
}

// CVA for type-safe styling
const buttonVariants = cva("base-styles", {
  variants: {
    variant: { primary: "...", secondary: "..." },
    size: { sm: "...", lg: "..." }
  }
});
```

**Alternatives Considered**:
- **Material-UI**: Too opinionated, large bundle
- **Chakra UI**: Good, but still constraints design
- **Ant Design**: Heavy, not modern enough

**Benefits**:
- ✅ Complete design control
- ✅ Smaller bundle size
- ✅ Type-safe component variants
- ✅ Easier to customize and maintain

### 4. Infinite Scroll Implementation Strategy

**Decision**: Custom infinite scroll with intersection observer

```typescript
// Our approach: Manual control with proper cleanup
const { posts, loadMore, hasMore } = useInfinitePosts();

return (
  <>
    {posts.map(post => <PostCard key={post.id} post={post} />)}
    <LoadMoreTrigger onLoadMore={loadMore} hasMore={hasMore} />
  </>
);
```

**Benefits**:
- ✅ Predictable behavior
- ✅ Easy to debug and test
- ✅ Works with our caching system
- ✅ No additional dependencies

## 🔄 Code Organization Patterns

### 1. Hook Composition Pattern

**Pattern**: Compose complex logic from simple hooks

```typescript
// Simple hooks
const useApi = (fetcher, config) => { /* ... */ };
const useClientSearch = (data, query) => { /* ... */ };
const useServerFilters = (filters) => { /* ... */ };

// Composed hook
export function usePostsWithFiltersAndSearch(config) {
  const { posts: serverData, ...infiniteApi } = useInfinitePosts(config);
  const { filteredData: posts } = useClientSearch(serverData, config.searchQuery);
  
  return { posts, ...infiniteApi };
}
```

**Benefits**:
- ✅ Single Responsibility Principle
- ✅ Easy to test individual pieces
- ✅ Reusable across different contexts
- ✅ Clear separation of concerns

### 2. Index Files for Clean Imports

**Pattern**: Use index files to create clean public APIs

```typescript
// entities/post/index.ts
export { PostCard, PostCardSkeleton } from './ui';
export { useInfinitePosts, usePostsWithFiltersAndSearch } from './model';
export type { Post, PostWithUser } from './model/types';

// Usage
import { PostCard, useInfinitePosts } from '@/entities/post';
```

### 3. Error Boundary Strategy

**Pattern**: Granular error boundaries at appropriate levels

```typescript
// High-level error boundary for entire features
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <PostsFilter />
</ErrorBoundary>

// Component-level error handling
const { data, error } = useApi(fetcher);
if (error) return <ErrorState onRetry={refetch} />;
```

### 4. Loading State Patterns

**Pattern**: Differentiate between initial loading and subsequent actions

```typescript
const { loading, loadingMore } = useInfinitePosts();

// Different UX for different loading states
if (loading && posts.length === 0) return <Skeleton />;
if (loadingMore) return <LoadingSpinner />;
```

## 🌊 Data Flow Architecture

### Request Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   UI Click  │───▶│ Hook Action  │───▶│ API Request │
└─────────────┘    └──────────────┘    └─────────────┘
                            │                   │
                            ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ UI Update   │◀───│ State Update │◀───│ Cache Store │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Caching Strategy

```typescript
// Multi-layer caching approach
class UniversalCacheManager {
  // Level 1: Memory cache (fastest)
  static memoryCache = new Map();
  
  // Level 2: localStorage (persistent)
  static persistentCache = localStorage;
  
  // Level 3: API request (slowest)
  static async fetchFromAPI() { /* ... */ }
}
```

**Cache Levels**:
1. **Memory Cache**: Instant access, lost on page refresh
2. **LocalStorage**: Survives page refresh, 5-10MB limit
3. **API Request**: Fresh data, network dependent

### State Management Philosophy

**Decision**: No global state management library

**Reasoning**:
- ✅ Application state is simple (mainly server state)
- ✅ Each feature manages its own local state
- ✅ Caching handles most "global" state needs
- ✅ Props drilling is minimal due to good component structure

**When to Add Redux/Zustand**:
- Complex cross-feature state sharing
- Undo/redo functionality
- Real-time multiplayer features
- Complex user preferences

## ⚡ Performance Optimizations

### 1. Bundle Optimization

```typescript
// Dynamic imports for routes
const PostDetailsModal = lazy(() => import('./PostDetailsModal'));

// Component-level code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 2. Rendering Optimizations

```typescript
// Memoization for expensive calculations
const filteredPosts = useMemo(() => 
  posts.filter(post => post.title.includes(searchQuery)),
  [posts, searchQuery]
);

// Stable references prevent unnecessary re-renders
const stableCallback = useCallback(() => {
  // Action logic
}, [stableDependencies]);
```

### 3. API Optimizations

```typescript
// Request deduplication
const requestCache = new Map();
export async function fetchWithDeduplication(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }
  
  const promise = fetch(url);
  requestCache.set(url, promise);
  return promise;
}

// Abort controllers for cleanup
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  
  return () => controller.abort();
}, []);
```

## 🎨 Design System Architecture

### Component Hierarchy

```
📁 shared/ui/           # Basic building blocks
├── Button/
├── Input/
├── Modal/
└── LoadingSpinner/

📁 entities/*/ui/       # Domain-specific components
├── PostCard/
├── UserAvatar/
└── PostCardSkeleton/

📁 features/*/ui/       # Feature components
├── PostsFilter/
├── SearchInput/
└── UserFilter/

📁 widgets/*/ui/        # Composite components
├── PostsFeed/
└── AppHeader/
```

### CVA System Benefits

```typescript
// Type-safe variants with automatic inference
const Button = ({ variant, size, ...props }) => (
  <button 
    className={cn(buttonVariants({ variant, size }))}
    {...props}
  />
);

// TypeScript automatically knows available variants
<Button variant="primary" size="lg" /> // ✅ Valid
<Button variant="invalid" />            // ❌ TypeScript error
```

### Accessibility Architecture

```typescript
// Consistent accessibility patterns
export function Modal({ children, ...props }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      {...props}
    >
      {children}
    </div>
  );
}

// Focus management hooks
export function useFocusManagement() {
  const [previousFocus, setPreviousFocus] = useState(null);
  
  const captureFocus = () => setPreviousFocus(document.activeElement);
  const restoreFocus = () => previousFocus?.focus();
  
  return { captureFocus, restoreFocus };
}
```

## 🔄 State Management Strategy

### Local State vs Server State

```typescript
// Local state: UI-only concerns
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// Server state: Data from API
const { posts, loading, error } = useApi(fetchPosts);
```

### State Colocation Principle

```typescript
// ✅ State close to where it's used
function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      <CardContent>
        {isExpanded ? post.fullContent : post.excerpt}
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ❌ Avoid: State far from usage
function App() {
  const [postExpansions, setPostExpansions] = useState({});
  // Now every component needs to know about this structure
}
```

### Cross-Component Communication

```typescript
// Pattern 1: Props drilling (preferred for nearby components)
<Parent>
  <Child onAction={handleAction} />
</Parent>

// Pattern 2: Custom hooks (preferred for related components)
const usePostModal = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  return { selectedPost, openPost: setSelectedPost, closePost: () => setSelectedPost(null) };
};

// Pattern 3: Context (only when necessary)
const PostContext = createContext();
```

## 🔮 Future Architecture Considerations

### Scalability Improvements

1. **Micro-Frontend Architecture**
   ```typescript
   // When the app grows, consider splitting features
   const PostsFeature = lazy(() => import('@features/posts'));
   const UsersFeature = lazy(() => import('@features/users'));
   ```

2. **Service Layer Introduction**
   ```typescript
   // For complex business logic
   class PostService {
     static async getPostsWithAnalytics(filters) {
       const posts = await fetchPosts(filters);
       const analytics = await fetchAnalytics(posts);
       return this.combinePostsWithAnalytics(posts, analytics);
     }
   }
   ```

3. **Event-Driven Architecture**
   ```typescript
   // For complex feature interactions
   const eventBus = new EventEmitter();
   
   // Feature A emits
   eventBus.emit('user.selected', user);
   
   // Feature B listens
   eventBus.on('user.selected', (user) => {
     // React to user selection
   });
   ```

### Performance Monitoring

```typescript
// Add performance monitoring hooks
export function usePerformanceMonitoring(componentName) {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`${componentName} render time:`, end - start);
    };
  });
}
```

### Testing Architecture

```typescript
// Future testing strategy
describe('PostsFeed Integration', () => {
  it('should load posts and handle user interactions', async () => {
    // MSW for API mocking
    server.use(
      rest.get('/api/posts', (req, res, ctx) => {
        return res(ctx.json(mockPosts));
      })
    );
    
    render(<PostsFeed />);
    
    // Test loading states
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Test loaded content
    await waitFor(() => {
      expect(screen.getByText('Post Title')).toBeInTheDocument();
    });
    
    // Test user interactions
    fireEvent.click(screen.getByText('Load More'));
    // ... more assertions
  });
});
```

## 📊 Architecture Metrics

### Code Organization Health

- **Cyclomatic Complexity**: ≤10 per function
- **File Size**: ≤300 lines per file
- **Import Depth**: ≤3 levels
- **Bundle Size**: ≤500KB initial load

### Performance Targets

- **First Contentful Paint**: ≤1.5s
- **Time to Interactive**: ≤3s
- **Core Web Vitals**: Green scores
- **Cache Hit Rate**: ≥80%

---

This architecture provides a solid foundation for a scalable, maintainable React application while remaining flexible enough to evolve with changing requirements. 