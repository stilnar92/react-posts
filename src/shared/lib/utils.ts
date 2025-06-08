import { ApiError } from '../types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility functions for the Social Feed application
 */

/**
 * Creates a standardized API error object
 * @param message - Error message
 * @param status - HTTP status code (optional)
 * @param originalError - Original error for debugging (optional)
 * @returns Structured API error
 */
export function createApiError(
  message: string,
  status?: number,
  originalError?: Error
): ApiError {
  const error: ApiError = { message };
  
  if (status !== undefined) {
    error.status = status;
  }
  
  if (originalError !== undefined) {
    error.originalError = originalError;
  }
  
  return error;
}

/**
 * Checks if a value is a valid non-empty string
 * @param value - Value to check
 * @returns True if value is a non-empty string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Checks if a value is a valid positive number
 * @param value - Value to check
 * @returns True if value is a positive number
 */
export function isValidId(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
}

/**
 * Safely truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!isValidString(text)) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Delays execution for specified milliseconds (useful for testing)
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Type guard to check if error is an instance of Error
 * @param error - Unknown error value
 * @returns True if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Utility function to merge class names with Tailwind CSS conflict resolution
 * Combines clsx for conditional classes and tailwind-merge for smart merging
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 