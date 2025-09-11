import React, { useState, useEffect } from "react";
import { AlertCircle, Database } from "lucide-react";

interface BackupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const BackupModal: React.FC<BackupModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(() => {
            onConfirm();
            onClose();
        }, 200);
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[9998] flex items-center justify-center transition-all duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ${isVisible ? 'scale-100' : 'scale-95'
                    }`}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                            {isDestructive ? (
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            ) : (
                                <Database className="w-6 h-6 text-blue-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDestructive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};