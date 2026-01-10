// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
    error: string;
    customerId: number | null;
    onBackClick: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error,
    customerId,
    onBackClick
}) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">{error}</p>
                <p className="text-sm text-gray-400 mb-4">Customer ID: {customerId}</p>
                <button
                    onClick={onBackClick}
                    className="px-4 py-2 bg-[#2C2C2C] text-white rounded-sm hover:bg-gray-700 transition-colors"
                >
                    Back to Customers
                </button>
            </div>
        </div>
    );
};