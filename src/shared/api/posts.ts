import { Post, FetchOptions, PaginatedPostsResponse, PaginationWithFiltersParams } from '../types';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_TIMEOUT, DEFAULT_HEADERS } from './config';

/**
 * Fetches paginated posts from JSONPlaceholder API with server-side filtering
 * @param params - Pagination and filter parameters
 * @param options - Optional fetch configuration
 * @returns Promise with paginated posts response
 * @throws Error when request fails
 */
export async function fetchPaginatedPosts(
  params: PaginationWithFiltersParams = {}, 
  options: FetchOptions = {}
): Promise<PaginatedPostsResponse> {
  const { page = 1, limit = 10, start, userId } = params;
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = options;
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Build query parameters for JSONPlaceholder API
    const queryParams = new URLSearchParams();
    
    if (start !== undefined) {
      // Use _start and _limit parameters
      queryParams.append('_start', start.toString());
      queryParams.append('_limit', limit.toString());
    } else {
      // Use _page and _limit parameters  
      queryParams.append('_page', page.toString());
      queryParams.append('_limit', limit.toString());
    }
    
    // Add server-side filtering
    if (userId !== undefined) {
      queryParams.append('userId', userId.toString());
    }
    
    const url = `${API_BASE_URL}${API_ENDPOINTS.posts}?${queryParams.toString()}`;
    
    if (import.meta.env.DEV) {
      console.log('fetchPaginatedPosts: requesting', { url, params });
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      signal: controller.signal,
    });
    
    // Clear timeout as request completed
    clearTimeout(timeoutId);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON response
    const posts: Post[] = await response.json();
    
    // Get total count from headers (JSONPlaceholder provides this)
    // Note: When filtering by userId, we need to adjust total count calculation
    let totalCount = parseInt(response.headers.get('x-total-count') || '100', 10);
    
    // If filtering by userId, JSONPlaceholder returns filtered total in headers
    // If no header available, estimate based on known data structure (10 posts per user)
    if (userId !== undefined && !response.headers.get('x-total-count')) {
      totalCount = 10; // JSONPlaceholder has 10 posts per user
    }
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = start !== undefined ? Math.floor(start / limit) + 1 : page;
    const hasMore = currentPage < totalPages;
    const nextPage = hasMore ? currentPage + 1 : undefined;
    
    // Validate response structure
    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format: expected array of posts');
    }
    
    // Basic validation of post structure
    posts.forEach((post, index) => {
      if (!post.id || !post.userId || !post.title || !post.body) {
        throw new Error(`Invalid post structure at index ${index}`);
      }
    });
    
    if (import.meta.env.DEV) {
      console.log('fetchPaginatedPosts: response', { 
        postsCount: posts.length, 
        totalCount, 
        currentPage, 
        hasMore,
        userId 
      });
    }
    
    return {
      data: posts,
      pagination: {
        page: currentPage,
        limit,
        total: totalCount,
        totalPages,
        hasMore,
        nextPage,
      },
    };
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle different error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw new Error(`Failed to fetch paginated posts: ${error.message}`);
    }
    
    throw new Error('Unknown error occurred while fetching paginated posts');
  }
}

/**
 * Fetches all posts from JSONPlaceholder API
 * @param options - Optional fetch configuration
 * @returns Promise with array of posts
 * @throws Error when request fails
 */
export async function fetchPosts(options: FetchOptions = {}): Promise<Post[]> {
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = options;
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.posts}`,
      {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
        },
        signal: controller.signal,
      }
    );
    
    // Clear timeout as request completed
    clearTimeout(timeoutId);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON response
    const posts: Post[] = await response.json();
    
    // Validate response structure
    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format: expected array of posts');
    }
    
    // Basic validation of post structure
    posts.forEach((post, index) => {
      if (!post.id || !post.userId || !post.title || !post.body) {
        throw new Error(`Invalid post structure at index ${index}`);
      }
    });
    
    return posts;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle different error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
    
    throw new Error('Unknown error occurred while fetching posts');
  }
} 