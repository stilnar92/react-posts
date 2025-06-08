// Re-export all shared hooks for clean imports
export { useApi, ApiUtils } from './useApi';
export { useInfiniteApi, UniversalCacheManager } from './useInfiniteApi';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useClientSearch } from './useClientSearch';
export { useDebugMode, type DebugConfig, type UseDebugModeReturn } from './useDebugMode';
export { useModal, type ModalState, type ModalActions, type UseModalReturn } from './useModal'; 