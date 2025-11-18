'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Root Error Boundary for the Application
 *
 * This catches all unhandled errors in the application and provides
 * a user-friendly error page with recovery options.
 *
 * Next.js automatically wraps this as an Error Boundary.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error to error reporting service (Sentry, LogRocket, etc.)
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to error tracking service
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We apologize for the inconvenience. Our team has been notified and is working on a fix.
          </p>
        </div>

        {/* Development-only error details */}
        {isDevelopment && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-mono text-red-800 break-all">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-red-700 mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a
              href="mailto:support@yourcompany.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
