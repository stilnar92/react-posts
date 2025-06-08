import { useMemo } from 'react';

/**
 * Configuration for useClientSearch hook
 */
interface UseClientSearchConfig<T> {
  /** Array of data to search through */
  data: T[];
  /** Search query string */
  searchQuery: string;
  /** Function to extract searchable fields from each item */
  searchFields: (item: T) => string[];
}

/**
 * Return interface for useClientSearch hook
 */
interface UseClientSearchReturn<T> {
  /** Filtered data based on search query */
  filteredData: T[];
  /** Number of matches found */
  matchCount: number;
  /** Whether there's an active search */
  hasActiveSearch: boolean;
  /** Original data count for reference */
  totalCount: number;
}

/**
 * Generic client-side search hook
 * 
 * Features:
 * - Case-insensitive search
 * - Multi-field search support
 * - Performance optimized with useMemo
 * - TypeScript generic support
 * - Works with any data type
 * 
 * @param config - Configuration object
 * @returns Object with filtered data and search metadata
 */
export function useClientSearch<T>({
  data,
  searchQuery,
  searchFields
}: UseClientSearchConfig<T>): UseClientSearchReturn<T> {
  
  const hasActiveSearch = Boolean(searchQuery?.trim());
  
  const filteredData = useMemo(() => {
    // If no search query, return all data
    if (!hasActiveSearch) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return data.filter(item => {
      // Get all searchable fields for this item
      const fields = searchFields(item);
      
      // Check if any field contains the search query
      return fields.some(field => 
        field?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, hasActiveSearch, searchFields]);

  if (import.meta.env.DEV) {
    console.log(`useClientSearch: query="${searchQuery}", matches=${filteredData.length}/${data.length}`);
  }

  return {
    filteredData,
    matchCount: filteredData.length,
    hasActiveSearch,
    totalCount: data.length,
  };
} 