"use client";
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = ''
}) => {
  return (
    <Alert variant="destructive" className={cn("flex items-center gap-3", className)}>
      <AlertCircle size={20} className="flex-shrink-0" />
      <AlertDescription className="flex-1 text-sm font-medium">
        {message}
      </AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-destructive/60 hover:text-destructive transition-colors ml-auto"
        >
          <X size={16} />
        </button>
      )}
    </Alert>
  );
};

export default ErrorMessage;