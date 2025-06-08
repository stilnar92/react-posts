import { useState, useCallback, useEffect } from 'react';

/**
 * Modal state interface
 */
export interface ModalState {
  /** Whether modal is open */
  isOpen: boolean;
  /** Modal data payload */
  data: any;
}

/**
 * Modal actions interface
 */
export interface ModalActions {
  /** Open modal with optional data */
  openModal: (data?: any) => void;
  /** Close modal */
  closeModal: () => void;
  /** Toggle modal state */
  toggleModal: () => void;
  /** Update modal data without changing open state */
  updateData: (data: any) => void;
}

/**
 * useModal hook return interface
 */
export interface UseModalReturn {
  /** Current modal state */
  state: ModalState;
  /** Modal actions */
  actions: ModalActions;
  /** Modal props for easier integration */
  modalProps: {
    isOpen: boolean;
    data: any;
    onClose: () => void;
  };
}

/**
 * General-purpose hook for modal management
 * 
 * Features:
 * - Modal open/close state management
 * - Data payload tracking
 * - Keyboard event handling (ESC to close)
 * - Body scroll lock when modal is open
 * - Clean actions API
 * - Ready-to-use modal props
 * - Generic data support
 * 
 * @returns Object with modal state and actions
 */
export function useModal(): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    data: null,
  });

  // Open modal with optional data
  const openModal = useCallback((data: any = null) => {
    setState({
      isOpen: true,
      data,
    });
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      data: null,
    });
  }, []);

  // Toggle modal state
  const toggleModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  // Update modal data without changing open state
  const updateData = useCallback((data: any) => {
    setState(prev => ({
      ...prev,
      data,
    }));
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isOpen) {
        closeModal();
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, closeModal]);

  // Create actions object
  const actions: ModalActions = {
    openModal,
    closeModal,
    toggleModal,
    updateData,
  };

  // Create ready-to-use modal props
  const modalProps = {
    isOpen: state.isOpen,
    data: state.data,
    onClose: closeModal,
  };

  // Debug logging in dev mode
  if (import.meta.env.DEV) {
    console.log('useModal: current state', {
      isOpen: state.isOpen,
      hasData: state.data !== null,
    });
  }

  return {
    state,
    actions,
    modalProps,
  };
} 