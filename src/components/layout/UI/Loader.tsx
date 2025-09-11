import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;