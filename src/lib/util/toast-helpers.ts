/**
 * Toast Helper Utilities
 * Provides consistent toast notifications across the application
 */

import { toast } from "sonner";
import { ParsedError, formatErrorForToast } from "./error-handler";

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

/**
 * Show error toast with enhanced error handling
 */
export function showErrorToast(
  error: string | ParsedError | any,
  fallbackMessage: string = 'An error occurred',
  options: ToastOptions = {}
) {
  const {
    duration = 5000,
    position = 'top-right'
  } = options;

  let message: string;
  let description: string | undefined;

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'type' in error) {
    // It's a ParsedError
    const parsedError = error as ParsedError;
    message = parsedError.message || fallbackMessage;

    // Add details as description
    if (parsedError.details && parsedError.details.length > 0) {
      description = parsedError.details.slice(0, 3).map(d => `• ${d}`).join('\n');
      if (parsedError.details.length > 3) {
        description += `\n• ... and ${parsedError.details.length - 3} more`;
      }
    }
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message || fallbackMessage;
  } else {
    message = fallbackMessage;
  }

  toast.error(message, {
    duration,
    position,
    description,
  });
}

/**
 * Show success toast
 */
export function showSuccessToast(
  message: string,
  options: ToastOptions = {}
) {
  const {
    duration = 3000,
    position = 'top-right'
  } = options;

  toast.success(message, {
    duration,
    position,
  });
}

/**
 * Show info toast
 */
export function showInfoToast(
  message: string,
  options: ToastOptions = {}
) {
  const {
    duration = 4000,
    position = 'top-right'
  } = options;

  toast.info(message, {
    duration,
    position,
  });
}

/**
 * Show warning toast
 */
export function showWarningToast(
  message: string,
  options: ToastOptions = {}
) {
  const {
    duration = 4000,
    position = 'top-right'
  } = options;

  toast.warning(message, {
    duration,
    position,
  });
}

/**
 * Handle API response and show appropriate toast
 */
export function handleApiResponse(
  response: { success: boolean; message?: string; error?: ParsedError },
  successMessage?: string,
  options: ToastOptions = {}
) {
  if (response.success) {
    if (successMessage) {
      showSuccessToast(successMessage, options);
    }
    return true;
  } else {
    showErrorToast(
      response.error || response.message || 'Operation failed',
      'Operation failed',
      options
    );
    return false;
  }
}
