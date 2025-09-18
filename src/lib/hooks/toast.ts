import { useState, useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Use Sonner for the actual toast display
    switch (type) {
      case 'success':
        sonnerToast.success(message);
        break;
      case 'error':
        sonnerToast.error(message);
        break;
      case 'warning':
        sonnerToast.warning(message);
        break;
      case 'info':
        sonnerToast.info(message);
        break;
      default:
        sonnerToast(message);
    }

    // Keep the old state for backward compatibility (though it won't be used for display)
    const id = Date.now();
    setToast(null); // Don't show the old toast component
    setToastVisible(false);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
    setToast(null);
  }, []);

  return {
    toast: null, // Always return null so old Toast components won't render
    toastVisible,
    showToast,
    hideToast,
  };
};
