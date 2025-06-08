import { FetchOptions } from '../types';
import { API_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_HEADERS } from './config';

/**
 * JSONPlaceholder User interface (extended version from API)
 */
export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/**
 * Fetches all users from JSONPlaceholder API
 * @param options - Optional fetch configuration
 * @returns Promise with array of users
 * @throws Error when request fails
 */
export async function fetchUsers(options: FetchOptions = {}): Promise<JsonPlaceholderUser[]> {
  const { timeout = DEFAULT_TIMEOUT, headers = {} } = options;
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/users`,
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
    const users: JsonPlaceholderUser[] = await response.json();
    
    // Validate response structure
    if (!Array.isArray(users)) {
      throw new Error('Invalid response format: expected array of users');
    }
    
    // Basic validation of user structure
    users.forEach((user, index) => {
      if (!user.id || !user.name || !user.username || !user.email) {
        throw new Error(`Invalid user structure at index ${index}`);
      }
    });
    
    if (import.meta.env.DEV) {
      console.log('fetchUsers: loaded', users.length, 'users');
    }
    
    return users;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle different error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    
    throw new Error('Unknown error occurred while fetching users');
  }
} 