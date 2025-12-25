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
    // Use Sonner with consistent styling across the app
    const toastOptions = {
      duration: 5000,
      position: "top-right" as const,
    };

    switch (type) {
      case 'success':
        sonnerToast.success(message, toastOptions);
        break;
      case 'error':
        sonnerToast.error(message, toastOptions);
        break;
      case 'warning':
        sonnerToast.warning(message, toastOptions);
        break;
      case 'info':
        sonnerToast.info(message, toastOptions);
        break;
      default:
        sonnerToast(message, toastOptions);
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
