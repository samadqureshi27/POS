"use client";
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

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
    <div className={`
      flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg
      text-red-800 ${className}
    `}>
      <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;