/**
 * Centralized Error Handler
 * Provides consistent error parsing and user-friendly messages across the application
 */

export interface ParsedError {
  title: string;
  message: string;
  details?: string[];
  technical?: string;
  type: 'validation' | 'authentication' | 'authorization' | 'not_found' | 'server' | 'network';
}

/**
 * Parse backend error response into user-friendly format
 */
export function parseApiError(error: any, fallbackMessage: string = 'An unexpected error occurred'): ParsedError {
  // Network errors (no response from server)
  if (!error || error.name === 'TypeError' || error.message?.includes('fetch')) {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network',
      technical: error?.message
    };
  }

  // Parse the error object
  let errorData = error;

  // If error has a response object (from fetch)
  if (error.response) {
    errorData = error.response;
  }

  // Extract error information from different possible structures
  const errorMessage =
    errorData?.error?.message ||
    errorData?.message ||
    errorData?.error ||
    fallbackMessage;

  const errorDetails = errorData?.error?.details || errorData?.details || [];
  const validationErrors = errorData?.error?.errors || errorData?.errors || [];
  const statusCode = errorData?.status || errorData?.statusCode;

  // Determine error type based on status code or message
  let type: ParsedError['type'] = 'server';
  let title = 'Error';

  if (statusCode === 400 || validationErrors.length > 0) {
    type = 'validation';
    title = 'Validation Error';
  } else if (statusCode === 401) {
    type = 'authentication';
    title = 'Authentication Required';
  } else if (statusCode === 403) {
    type = 'authorization';
    title = 'Permission Denied';
  } else if (statusCode === 404) {
    type = 'not_found';
    title = 'Not Found';
  } else if (statusCode >= 500) {
    type = 'server';
    title = 'Server Error';
  }

  // Build details array
  const details: string[] = [];

  // Add validation errors if present
  if (validationErrors.length > 0) {
    validationErrors.forEach((err: any) => {
      if (typeof err === 'string') {
        details.push(err);
      } else if (err.field && err.message) {
        details.push(`${err.field}: ${err.message}`);
      } else if (err.message) {
        details.push(err.message);
      }
    });
  }

  // Add error details if present
  if (Array.isArray(errorDetails)) {
    details.push(...errorDetails);
  }

  return {
    title,
    message: getUserFriendlyMessage(errorMessage, type),
    details: details.length > 0 ? details : undefined,
    technical: errorMessage,
    type
  };
}

/**
 * Convert technical error messages to user-friendly ones
 */
function getUserFriendlyMessage(message: string, type: ParsedError['type']): string {
  const lowerMessage = message.toLowerCase();

  // Common error patterns and their user-friendly alternatives
  const errorMappings: Record<string, string> = {
    'route not found': 'The requested feature is currently unavailable.',
    'unauthorized': 'You need to log in to perform this action.',
    'forbidden': 'You don\'t have permission to perform this action.',
    'not found': 'The requested item could not be found.',
    'network error': 'Connection to the server was lost. Please try again.',
    'timeout': 'The request took too long. Please try again.',
    'internal server error': 'A server error occurred. Our team has been notified.',
    'bad request': 'The request contains invalid data. Please check your input.',
    'duplicate': 'This item already exists.',
    'invalid': 'The provided information is invalid.',
    'required': 'Required information is missing.',
    'validation failed': 'Please check the form for errors.',
    'conflict': 'This action conflicts with existing data.',
  };

  // Check if message matches any known pattern
  for (const [pattern, friendly] of Object.entries(errorMappings)) {
    if (lowerMessage.includes(pattern)) {
      return friendly;
    }
  }

  // Type-specific defaults
  switch (type) {
    case 'validation':
      return 'Please correct the highlighted errors and try again.';
    case 'authentication':
      return 'Please log in to continue.';
    case 'authorization':
      return 'You don\'t have permission to perform this action.';
    case 'not_found':
      return 'The requested resource was not found.';
    case 'network':
      return 'Network connection failed. Please check your internet.';
    case 'server':
      return 'A server error occurred. Please try again later.';
    default:
      // Return the original message if no mapping found
      return message || 'An unexpected error occurred.';
  }
}

/**
 * Format error for toast display
 */
export function formatErrorForToast(parsedError: ParsedError): string {
  let message = parsedError.message;

  // Add details if present (max 3)
  if (parsedError.details && parsedError.details.length > 0) {
    const detailsToShow = parsedError.details.slice(0, 3);
    message += '\n\n' + detailsToShow.map(d => `• ${d}`).join('\n');

    if (parsedError.details.length > 3) {
      message += `\n• ... and ${parsedError.details.length - 3} more`;
    }
  }

  return message;
}

/**
 * Handle API response errors consistently
 */
export function handleApiError(
  error: any,
  context: string,
  fallbackMessage?: string
): ParsedError {
  const parsed = parseApiError(error, fallbackMessage || `Failed to ${context}`);

  // Log technical details for debugging
  console.error(`❌ Error in ${context}:`, {
    type: parsed.type,
    message: parsed.message,
    technical: parsed.technical,
    details: parsed.details,
    originalError: error
  });

  return parsed;
}

/**
 * Extract error from service response
 */
export function extractServiceError(response: any): any {
  if (!response || response.success) {
    return null;
  }

  return {
    message: response.message,
    error: response.error,
    errors: response.errors,
    status: response.status,
    statusCode: response.statusCode
  };
}
