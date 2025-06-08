/**
 * Post entity interface based on JSONPlaceholder API
 * https://jsonplaceholder.typicode.com/posts
 */
export interface Post {
  /** ID of the user who created the post */
  userId: number;
  /** Unique identifier for the post */
  id: number;
  /** Post title */
  title: string;
  /** Post content/body */
  body: string;
} 