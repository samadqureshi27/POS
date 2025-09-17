import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

export const Toast = React.memo<ToastProps>(({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={16} />;
            case 'error':
                return <AlertCircle size={16} />;
            case 'warning':
                return <AlertTriangle size={16} />;
            case 'info':
                return <Info size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return "bg-green-400 text-white";
            case 'error':
                return "bg-red-400 text-white";
            case 'warning':
                return "bg-yellow-400 text-white";
            case 'info':
                return "bg-blue-400 text-white";
            default:
                return "bg-blue-400 text-white";
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-out transform ${getBackgroundColor()} ${isVisible && !isClosing
                    ? "translate-x-0 opacity-100"
                    : isClosing
                        ? "translate-x-full opacity-0"
                        : "translate-x-full opacity-0"
                }`}
        >
            {getIcon()}
            <span>{message}</span>
            <button
                onClick={handleClose}
                className="ml-2 hover:bg-black/10 rounded p-1 transition-colors duration-200"
            >
                <X size={16} />
            </button>
        </div>
    );
});

Toast.displayName = "Toast";