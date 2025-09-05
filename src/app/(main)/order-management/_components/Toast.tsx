// _components/UI/Toast.tsx
import React from 'react';
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { ToastProps } from '../../../../types/types';

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 ${
        type === "success" 
          ? "bg-green-500 text-white" 
          : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;