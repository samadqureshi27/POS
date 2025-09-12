// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    customerId: number | null;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ customerId }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Customer Profile...</p>
                <p className="text-sm text-gray-400 mt-2">Customer ID: {customerId}</p>
            </div>
        </div>
    );
};