/**
 * User color mapping based on UI requirements
 * Each user gets a specific color for their avatar
 */
const USER_COLORS = {
  1: 'blue',    // User 1: Blue (#3B82F6)
  2: 'green',   // User 2: Green (#10B981)
  3: 'purple',  // User 3: Purple fallback
  4: 'purple',  // User 4: Purple (#8B5CF6)
  5: 'pink',    // User 5: Pink (#EC4899)
  6: 'blue',    // User 6: Blue fallback
  7: 'green',   // User 7: Green fallback
  8: 'pink',    // User 8: Pink fallback
  9: 'purple',  // User 9: Purple fallback
  10: 'blue',   // User 10: Blue fallback
} as const;

/**
 * Get user initials for avatar display
 * Format: "U" + userId (e.g., "U1", "U4")
 * 
 * @param userId - User ID number
 * @returns User initials string
 */
export function getUserInitials(userId: number): string {
  return `U${userId}`;
}

/**
 * Get avatar color for specific user based on UI requirements
 * Maps user IDs to specific colors as defined in the design
 * 
 * @param userId - User ID number  
 * @returns Color variant for avatar
 */
export function getUserAvatarColor(userId: number): 'blue' | 'green' | 'purple' | 'pink' | 'gray' {
  return USER_COLORS[userId as keyof typeof USER_COLORS] || 'gray';
}

/**
 * Get display name for user
 * Format: "User " + userId (e.g., "User 1", "User 4")
 * 
 * @param userId - User ID number
 * @returns User display name
 */
export function getUserName(userId: number): string {
  return `User ${userId}`;
}

/**
 * Get user ID display format
 * Format: "ID: " + userId (e.g., "ID: 1", "ID: 4")
 * 
 * @param userId - User ID number
 * @returns Formatted user ID string
 */
export function getUserIdDisplay(userId: number): string {
  return `ID: ${userId}`;
} 