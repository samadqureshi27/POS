/**
 * Centralized Error Logging Utility
 *
 * Provides consistent error logging across the application with context,
 * severity levels, and optional external service integration.
 *
 * Usage:
 * - logger.error("Error message", error, { context: "ComponentName" })
 * - logger.warn("Warning message", { userId: "123" })
 * - logger.info("Info message")
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log error with context
   * @param message - Error message
   * @param error - Error object (optional)
   * @param context - Additional context (optional)
   */
  error(message: string, error?: any, context?: LogContext): void {
    const errorDetails = this.formatError(message, error, context);

    // Always log to console in development
    if (this.isDevelopment) {
      console.error(`❌ ${errorDetails.message}`, errorDetails.error || '', errorDetails.context || '');
    }

    // In production, send to external service (e.g., Sentry, LogRocket)
    if (!this.isDevelopment) {
      this.sendToExternalService('error', errorDetails);
    }
  }

  /**
   * Log warning with context
   * @param message - Warning message
   * @param context - Additional context (optional)
   */
  warn(message: string, context?: LogContext): void {
    const logDetails = this.formatLog(message, context);

    if (this.isDevelopment) {
      console.warn(`⚠️ ${logDetails.message}`, logDetails.context || '');
    }

    if (!this.isDevelopment) {
      this.sendToExternalService('warn', logDetails);
    }
  }

  /**
   * Log info message
   * @param message - Info message
   * @param context - Additional context (optional)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const logDetails = this.formatLog(message, context);
      console.info(`ℹ️ ${logDetails.message}`, logDetails.context || '');
    }
  }

  /**
   * Log debug message (development only)
   * @param message - Debug message
   * @param data - Any data to log
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`🔍 ${message}`, data || '');
    }
  }

  /**
   * Format error details
   */
  private formatError(message: string, error?: any, context?: LogContext) {
    return {
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context: context || {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format log details
   */
  private formatLog(message: string, context?: LogContext) {
    return {
      message,
      context: context || {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send logs to external service (placeholder)
   * In production, integrate with services like:
   * - Sentry: Sentry.captureException()
   * - LogRocket: LogRocket.captureException()
   * - Custom API endpoint
   */
  private sendToExternalService(level: LogLevel, details: any): void {
    // TODO: Integrate with external logging service
    // Example: Sentry.captureException(details.error, { extra: details.context });

    // For now, just log to console in production with minimal output
    console.error(`[${level.toUpperCase()}]`, details.message);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Legacy console.error replacement helper
 * Use this to migrate existing console.error calls:
 *
 * Before: console.error("Error loading data:", error);
 * After:  logError("Error loading data", error);
 */
export function logError(message: string, error?: any, context?: LogContext): void {
  logger.error(message, error, context);
}

/**
 * Legacy console.warn replacement
 */
export function logWarn(message: string, context?: LogContext): void {
  logger.warn(message, context);
}

/**
 * Legacy console.log replacement for info
 */
export function logInfo(message: string, context?: LogContext): void {
  logger.info(message, context);
}
