/**
 * UNIVERSAL Toast System
 * THE ONLY toast system to be used across the entire application
 * DO NOT use toast.error, toast.success, etc. directly - ALWAYS use these helpers
 */

import { toast } from "sonner";
import { ParsedError, parseApiError } from "./error-handler";

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

/**
 * Universal error toast - handles any error type (string, object, API response)
 * Use this for ALL error notifications in the app
 */
export function showError(
  error: string | ParsedError | { message?: string; error?: any; [key: string]: any } | any,
  options: ToastOptions = {}
) {
  return showErrorToast(error, undefined, options);
}

/**
 * Universal success toast
 * Use this for ALL success notifications in the app
 */
export function showSuccess(
  message: string,
  options: ToastOptions = {}
) {
  return showSuccessToast(message, options);
}

/**
 * Show error toast with enhanced error handling
 * Handles: strings, ParsedError, API responses, Error objects
 */
export function showErrorToast(
  error: string | ParsedError | any,
  fallbackMessage?: string,
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
  } else if (error && typeof error === 'object') {
    // Check if it's a ParsedError
    if ('type' in error && 'message' in error) {
      const parsedError = error as ParsedError;
      message = parsedError.message || fallbackMessage || 'An error occurred';

      // Add details as description
      if (parsedError.details && parsedError.details.length > 0) {
        description = parsedError.details.slice(0, 3).map(d => `• ${d}`).join('\n');
        if (parsedError.details.length > 3) {
          description += `\n• ... and ${parsedError.details.length - 3} more`;
        }
      }
    }
    // Check if it's an API response object (has error or message property)
    else if ('error' in error || 'message' in error) {
      // Try to extract the actual error
      const apiError = error.error || error.message || error;

      // If error.error is a ParsedError or object, parse it
      if (typeof apiError === 'object' && apiError !== null) {
        const parsed = parseApiError(apiError, fallbackMessage);
        message = parsed.message;
        if (parsed.details && parsed.details.length > 0) {
          description = parsed.details.slice(0, 3).map(d => `• ${d}`).join('\n');
        }
      } else {
        message = String(apiError) || fallbackMessage || 'An error occurred';
      }
    }
    // Fallback: try to get message property or stringify
    else {
      message = error.message || fallbackMessage || 'An error occurred';
    }
  } else {
    message = fallbackMessage || 'An error occurred';
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

// ============================================================================
// UNIVERSAL EXPORTS - Use these everywhere in the app
// ============================================================================

/**
 * Universal toast object - THE ONLY WAY to show toasts in the app
 * Replace all direct toast.error/toast.success with these
 *
 * Usage:
 *   Toast.error(response)           // For API errors
 *   Toast.error("Something failed") // For simple errors
 *   Toast.success("Saved!")         // For success messages
 */
export const Toast = {
  /**
   * Show error - handles any error type
   * @example Toast.error(response)
   * @example Toast.error("Failed to save")
   * @example Toast.error(error.message)
   */
  error: showError,

  /**
   * Show success message
   * @example Toast.success("Item saved successfully")
   */
  success: showSuccess,

  /**
   * Show info message
   * @example Toast.info("Processing...")
   */
  info: showInfoToast,

  /**
   * Show warning message
   * @example Toast.warning("This action cannot be undone")
   */
  warning: showWarningToast,
};
