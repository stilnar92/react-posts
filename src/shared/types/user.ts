/**
 * User entity interface for avatar generation and user identification
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User display name */
  name: string;
  /** User initials for avatar display (e.g., "U1", "U4") */
  initials: string;
}

/**
 * User avatar color mapping interface for distinct user identification
 */
export interface UserAvatarColor {
  /** User ID */
  userId: number;
  /** Background color for avatar (hex format) */
  backgroundColor: string;
} 