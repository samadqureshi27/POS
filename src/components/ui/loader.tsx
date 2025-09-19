// @deprecated - Use LoaderComponent or Skeleton components instead
// This component is kept for backward compatibility but should not be used in new code
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;