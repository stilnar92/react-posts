# API Reference - React Posts App

## Overview

This document describes the API architecture and data fetching patterns used in the React Posts App. The application follows Feature-Sliced Design (FSD) architecture with TypeScript and implements advanced caching patterns using JSONPlaceholder API.

**Base URL**: `https://jsonplaceholder.typicode.com`

## Project Architecture

### FSD API Layer Structure

```
src/
├── shared/
│   ├── api/             # API layer (bottom of FSD stack)
│   │   ├── config.ts    # API configuration
│   │   ├── posts.ts     # Posts API functions
│   │   ├── users.ts     # Users API functions
│   │   └── index.ts     # Barrel exports
│   ├── hooks/           # Custom data fetching hooks
│   │   ├── useApi.ts    # Generic API hook with caching
│   │   ├── useInfiniteApi.ts # Infinite scroll API hook
│   │   └── index.ts     # Hook exports
│   └── types/           # TypeScript API types
│       ├── api.ts       # API response types
│       ├── post.ts      # Post entity types
│       └── user.ts      # User entity types
├── entities/
│   ├── post/           # Post entity with domain logic
│   └── user/           # User entity with hooks
└── features/           # Feature-specific API integrations
```

## API Configuration

### Base Configuration

```typescript
// src/shared/api/config.ts
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const API_ENDPOINTS = {
  posts: '/posts',
  users: '/users',
  comments: '/comments',
} as const;

export const DEFAULT_TIMEOUT = 10000; // 10 seconds
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;
```

## TypeScript Types

### Core API Types

```typescript
// src/shared/types/api.ts

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** API error with status code */
export interface ApiError {
  message: string;
  status?: number;
  originalError?: Error;
}

/** Pagination parameters */
export interface PaginationParams {
  page?: number;        // 1-based page number
  limit?: number;       // Items per page
  start?: number;       // 0-based start index
}

/** Server-side filtering support */
export interface PaginationWithFiltersParams extends PaginationParams {
  userId?: number;      // Filter by user ID
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  nextPage?: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
```

### Entity Types

```typescript
// src/shared/types/post.ts
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// src/shared/types/user.ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  // ... other JSONPlaceholder user properties
}
```

## API Layer Functions

### Posts API

```typescript
// src/shared/api/posts.ts
import { Post, PaginationWithFiltersParams, PaginatedPostsResponse } from '../types';

/**
 * Fetch all posts from JSONPlaceholder
 * Used for simple, cached data fetching
 */
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.posts}`, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch paginated posts with optional user filtering
 * Supports infinite scroll and server-side filtering
 */
export async function fetchPaginatedPosts(params: PaginationWithFiltersParams): Promise<PaginatedPostsResponse> {
  const { page = 1, limit = 10, userId } = params;
  const start = (page - 1) * limit;

  // Build query parameters
  const searchParams = new URLSearchParams({
    _start: start.toString(),
    _limit: limit.toString(),
  });

  // Add user filter if specified
  if (userId) {
    searchParams.append('userId', userId.toString());
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.posts}?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch paginated posts: ${response.status}`);
  }

  const data = await response.json();
  const totalCount = parseInt(response.headers.get('x-total-count') || '100', 10);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: start + data.length < totalCount,
      nextPage: start + data.length < totalCount ? page + 1 : undefined,
    },
  };
}
```

### Users API

```typescript
// src/shared/api/users.ts
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
    headers: DEFAULT_HEADERS,
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return response.json();
}
```

## Custom Hooks

### useApi Hook - Single Resource with Caching

```typescript
// Usage example
import { useApi } from '../../shared/hooks';
import { fetchPosts } from '../../shared/api';

export function useSimplePosts() {
  return useApi(fetchPosts, {
    cacheKey: 'posts',
    cacheTtl: 5 * 60 * 1000,        // 5 minutes
    enabled: true,
    persistentCache: true,           // Uses localStorage
    refetchOnFocus: false,
  });
}

// Hook interface
interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  invalidateCache: () => void;
}
```

### useInfiniteApi Hook - Infinite Scroll with Caching

```typescript
// Usage example
import { useInfiniteApi } from '../../shared/hooks';
import { fetchPaginatedPosts } from '../../shared/api';

export function useInfinitePosts(userId?: number) {
  return useInfiniteApi(
    (page) => fetchPaginatedPosts({ page, limit: 10, userId }),
    {
      cacheKey: userId ? `posts-user-${userId}` : 'posts-all',
      cacheTtl: 5 * 60 * 1000,
      enabled: true,
      persistentCache: true,
    }
  );
}

// Hook interface
interface UseInfiniteApiReturn<T> {
  data: T[];                    // Flattened array of all pages
  pages: PaginatedResponse<T>[]; // Array of page responses
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: () => void;
  refetch: () => void;
  invalidateCache: () => void;
}
```

## Entity-Level Hooks

### User Entity Hook

```typescript
// src/entities/user/lib/useUsers.ts
import { useApi } from '../../../shared/hooks';
import { fetchUsers } from '../../../shared/api';

export function useUsers() {
  const { data, loading, error, refetch, invalidateCache } = useApi(fetchUsers, {
    cacheKey: 'users',
    cacheTtl: 10 * 60 * 1000, // 10 minutes (users change rarely)
    persistentCache: true,
  });

  return {
    users: data || [],
    isLoading: loading,
    isError: !!error,
    error,
    refetch,
    invalidateCache,
  };
}
```

## Caching System

### Cache Architecture

The project implements a sophisticated caching system with multiple layers:

1. **Memory Cache**: Fast in-memory storage for current session
2. **Persistent Cache**: localStorage-based cache that survives page reloads
3. **Stale-While-Revalidate**: Shows cached data immediately while fetching fresh data
4. **Cache Invalidation**: Manual and automatic cache invalidation strategies

### Cache Keys Strategy

```typescript
// Cache key patterns used in the project
const CACHE_KEYS = {
  // Simple resources
  posts: 'posts',
  users: 'users',
  
  // Filtered resources
  userPosts: (userId: number) => `posts-user-${userId}`,
  
  // Infinite scroll resources
  infinitePosts: 'posts-all',
  infiniteUserPosts: (userId: number) => `posts-user-${userId}`,
};
```

### Cache Configuration

```typescript
interface CacheConfig {
  cacheTtl: number;           // Time-to-live in milliseconds
  persistentCache: boolean;   // Use localStorage vs memory only
  staleThreshold: number;     // When to show stale data (30s default)
}

// Common TTL values used in project
const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes (frequently changing data)
  MEDIUM: 5 * 60 * 1000,     // 5 minutes (posts, default)
  LONG: 10 * 60 * 1000,      // 10 minutes (users, rarely change)
};
```

## Error Handling

### Error Types and Handling

```typescript
// Error handling patterns used throughout the project

try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
  
} catch (error) {
  // Handle different error types
  if (error instanceof TypeError) {
    // Network error
    throw new Error('Network error: Please check your internet connection');
  } else if (error.name === 'AbortError') {
    // Request was cancelled
    throw new Error('Request was cancelled');
  } else if (error.name === 'TimeoutError') {
    // Request timeout
    throw new Error('Request timed out');
  } else {
    // Re-throw other errors
    throw error;
  }
}
```

### Error Recovery

```typescript
// Example error boundary integration
export function useApiWithRetry<T>(
  fetcher: () => Promise<T>,
  config: UseApiConfig & { maxRetries?: number }
) {
  const { maxRetries = 3 } = config;
  
  const fetchWithRetry = useCallback(
    async (attempt = 1): Promise<T> => {
      try {
        return await fetcher();
      } catch (error) {
        if (attempt < maxRetries && !isUserError(error)) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
          return fetchWithRetry(attempt + 1);
        }
        throw error;
      }
    },
    [fetcher, maxRetries]
  );

  return useApi(fetchWithRetry, config);
}
```

## Performance Optimizations

### Request Deduplication

```typescript
// Prevent duplicate requests for the same resource
const ongoingRequests = new Map<string, Promise<any>>();

export function deduplicateRequest<T>(
  key: string, 
  fetcher: () => Promise<T>
): Promise<T> {
  if (ongoingRequests.has(key)) {
    return ongoingRequests.get(key)!;
  }

  const promise = fetcher().finally(() => {
    ongoingRequests.delete(key);
  });

  ongoingRequests.set(key, promise);
  return promise;
}
```

### AbortController Integration

```typescript
// All hooks use AbortController for cleanup
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal);
  
  return () => {
    controller.abort(); // Cancel request on cleanup
  };
}, [dependency]);
```

## Feature Integration Examples

### Posts Feed with Filtering

```typescript
// src/widgets/posts-feed/ui/PostsFeed.tsx
export function PostsFeed() {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  
  // Infinite scroll posts with optional user filtering
  const {
    data: posts,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchMore
  } = useInfinitePosts(selectedUserId);

  // Client-side search within loaded posts
  const {
    data: filteredPosts,
    query: searchQuery,
    setQuery: setSearchQuery
  } = useClientSearch(posts, ['title', 'body']);

  return (
    <div>
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedUserId={selectedUserId}
        onUserFilterChange={setSelectedUserId}
      />
      <PostsList 
        posts={filteredPosts}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={fetchMore}
      />
    </div>
  );
}
```

## Testing Integration

### Mock API for Tests

```typescript
// src/shared/api/__mocks__/posts.ts
export const mockPosts: Post[] = [
  { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1' },
  { id: 2, userId: 2, title: 'Test Post 2', body: 'Test body 2' },
];

export const fetchPosts = jest.fn(() => Promise.resolve(mockPosts));
export const fetchPaginatedPosts = jest.fn((params) => 
  Promise.resolve({
    data: mockPosts.slice(0, params.limit),
    pagination: {
      page: params.page || 1,
      limit: params.limit || 10,
      total: mockPosts.length,
      totalPages: Math.ceil(mockPosts.length / (params.limit || 10)),
      hasMore: false,
    }
  })
);
```

### Hook Testing

```typescript
// Testing hooks with React Testing Library
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

test('useApi returns data after successful fetch', async () => {
  const mockFetcher = jest.fn(() => Promise.resolve(['test data']));
  
  const { result } = renderHook(() => 
    useApi(mockFetcher, { cacheKey: 'test' })
  );

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual(['test data']);
  expect(result.current.error).toBeNull();
});
```

## Migration and Compatibility

### Upgrading from Simple Fetch

```typescript
// Before: Simple fetch
useEffect(() => {
  fetch('/api/posts')
    .then(res => res.json())
    .then(setPosts)
    .catch(setError);
}, []);

// After: Using project hooks
const { data: posts, loading, error } = useApi(fetchPosts, {
  cacheKey: 'posts',
  cacheTtl: 5 * 60 * 1000,
});
```

### Adding New Resources

```typescript
// 1. Add to API config
export const API_ENDPOINTS = {
  posts: '/posts',
  users: '/users',
  comments: '/comments', // New endpoint
} as const;

// 2. Create API function
export async function fetchComments(): Promise<Comment[]> {
  // Implementation
}

// 3. Create entity hook
export function useComments() {
  return useApi(fetchComments, {
    cacheKey: 'comments',
    cacheTtl: 5 * 60 * 1000,
  });
}
```

This API architecture provides:
- **Type Safety**: Full TypeScript coverage with strict types
- **Performance**: Advanced caching with persistence and deduplication
- **Developer Experience**: Clean, predictable patterns following FSD
- **Scalability**: Easy to extend with new resources and features
- **Reliability**: Comprehensive error handling and retry mechanisms
- **Testing**: Built for testability with clear separation of concerns