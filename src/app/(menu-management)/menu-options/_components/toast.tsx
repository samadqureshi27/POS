// components/Toast.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { ToastProps } from '@/types/interfaces';

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${type === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"
        } ${isVisible && !isClosing
          ? "translate-x-0 opacity-100"
          : isClosing
            ? "translate-x-full opacity-0"
            : "translate-x-full opacity-0"
        }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 hover:bg-black/10 rounded p-1 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;